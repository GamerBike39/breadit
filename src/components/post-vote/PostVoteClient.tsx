'use client'


import { PostVoteRequest } from '@/lib/validators/vote'
import { usePrevious } from '@mantine/hooks'
import { VoteType } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { Button } from '../ui/Button'
import { ArrowBigDown, ArrowBigUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCustomToast } from '@/hooks/useCustomToast'
import { toast } from '../ui/use-toast'


interface PostVoteClientProps {
  postId: string
  initialVotesAmt: number
  initialVote?: VoteType
}

const PostVoteClient = ({
  postId,
  initialVotesAmt,
  initialVote,
}: PostVoteClientProps) => {
  const { loginToast } = useCustomToast()
  const [votesAmt, setVotesAmt] = useState<number>(initialVotesAmt)
  const [currentVote, setCurrentVote] = useState(initialVote)
  const prevVote = usePrevious(currentVote)
  const [isVoting, setIsVoting] = useState(false)

  // Assurez-vous de la synchronisation avec le serveur
  useEffect(() => {
    setCurrentVote(initialVote)
  }, [initialVote])

  const { mutate: vote, isLoading } = useMutation({
    mutationFn: async (type: VoteType) => {
      const payload: PostVoteRequest = {
        voteType: type,
        postId: postId,
      }

      await axios.patch('/api/subreddit/post/vote', payload)
    },
    onError: (err, voteType) => {
      if (voteType === 'UP') setVotesAmt((prev) => prev - 1)
      else if (voteType === 'DOWN') setVotesAmt((prev) => prev + 1)

      // Réinitialisez le vote actuel
      setCurrentVote(prevVote)

      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast()
        }
      }

      return toast({
        title: 'Quelque chose s\'est mal passé.',
        description: 'Votre vote n\'a pas été enregistré. Veuillez réessayer.',
        variant: 'destructive',
      })
    },
    onMutate: async (type: VoteType) => {
      if (isVoting || isLoading) return // Empêche les votes simultanés multiples ou pendant le chargement

      setIsVoting(true)

      try {
        if (currentVote === type) {
          // L'utilisateur vote de la même manière, donc supprimez son vote
          setCurrentVote(undefined)
          if (type === 'UP') setVotesAmt((prev) => prev - 1)
          else if (type === 'DOWN') setVotesAmt((prev) => prev + 1)
        } else {
          // L'utilisateur vote dans la direction opposée, donc soustrayez 2
          setCurrentVote(type)
          if (type === 'UP') setVotesAmt((prev) => prev + (currentVote ? 2 : 1))
          else if (type === 'DOWN')
            setVotesAmt((prev) => prev - (currentVote ? 2 : 1))
        }

        // Effectuer la requête API
        await vote(type)
      } catch (error) {
        // Gérer l'erreur
      } finally {
        setIsVoting(false)
      }
    },
  })

  return (
    <div className='flex flex-col gap-4 sm:gap-0 pr-6 sm:w-20 pb-4 sm:pb-0'>
      {/* Bouton d'upvote */}
      <Button
        onClick={() => vote('UP')}
        size='sm'
        variant='ghost'
        aria-label='upvote'
        disabled={isLoading} // Désactiver le bouton pendant le chargement
      >
        <ArrowBigUp
          className={cn('h-5 w-5 text-zinc-700', {
            'text-emerald-500 fill-emerald-500': currentVote === 'UP',
          })}
        />
      
      </Button>

      {/* Score */}
      <p className='text-center py-2 font-medium text-sm text-zinc-900'>
        {votesAmt}
      </p>

      {/* Bouton de downvote */}
      <Button
        onClick={() => vote('DOWN')}
        size='sm'
        className={cn({
          'text-emerald-500': currentVote === 'DOWN',
        })}
        variant='ghost'
        aria-label='downvote'
        disabled={isLoading} // Désactiver le bouton pendant le chargement
      >
        <ArrowBigDown
          className={cn('h-5 w-5 text-zinc-700', {
            'text-red-500 fill-red-500': currentVote === 'DOWN',
          })}
        />
      </Button>
    </div>
  )
}


export default PostVoteClient