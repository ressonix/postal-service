import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { ArrowLongDownIcon } from '@heroicons/react/20/solid'
import Confetti from 'react-confetti'
import Layout from '@/components/Layout'
import Head from 'next/head'
import {
  DestinationAccountCard,
  SourceAccountCard
} from '@/components/Migrate/AccountCard'

const Migrate = () => {
  const [sourceServer, setSourceServer] = useState<string>('')
  const [sourceServerError, setSourceServerError] = useState<any>(null)
  const [sourcePort, setSourcePort] = useState<number>(993)
  const [sourceUsername, setSourceUsername] = useState<string>('')
  const [sourcePassword, setSourcePassword] = useState<string>('')
  const [sourceSecure, setSourceSecure] = useState<boolean>(true)

  const [destinationServer, setDestinationServer] = useState<string>('')
  const [destinationServerError, setDestinationServerError] =
    useState<any>(null)
  const [destinationPort, setDestinationPort] = useState<number>(993)
  const [destinationUsername, setDestinationUsername] = useState<string>('')
  const [destinationPassword, setDestinationPassword] = useState<string>('')
  const [destinationSecure, setDestinationSecure] = useState<boolean>(true)

  const [successMessage, setSuccessMessage] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const [loading, setLoading] = useState<boolean>(false)

  const loadingList: any = useMemo(
    () => [
      'Working. Please wait...',
      'Still working...',
      'This may take a bit...',
      'Just a little while longer...',
      'Almost there...',
      'Moving lots of messages...',
      'Hang tight...'
    ],
    []
  )

  const [loadingIndex, setLoadingIndex] = useState(0)

  useEffect(() => {
    let intervalId: NodeJS.Timeout

    if (loading) {
      intervalId = setInterval(() => {
        setLoadingIndex(
          (loadingIndex) => (loadingIndex + 1) % loadingList.length
        )
      }, 20000)
    }

    return () => {
      clearInterval(intervalId)
    }
  }, [loading, loadingList])

  const handleMigrate = async () => {
    let response: any | null = null

    try {
      setLoading(true)
      response = await axios.post<{ message: string }>('/api/migrate', {
        sourceServer,
        sourcePort,
        sourceUsername,
        sourcePassword,
        sourceSecure,
        destinationServer,
        destinationPort,
        destinationUsername,
        destinationPassword,
        destinationSecure
      })

      setSuccessMessage(response.data.message)
      setTimeout(() => setSuccessMessage(''), 10000)

      setSourceServer('')
      setSourcePort(993)
      setSourceUsername('')
      setSourcePassword('')
      setSourceSecure(true)

      setDestinationServer('')
      setDestinationPort(993)
      setDestinationUsername('')
      setDestinationPassword('')
      setDestinationSecure(true)
    } catch (error: any) {
      setErrorMessage(
        'An error occurred. Please double check the information provided and try again.'
      )
      setTimeout(() => setErrorMessage(''), 10000)
    } finally {
      setLoading(false)
      setLoadingIndex(0)
    }
  }

  function classNames(...classes: Array<string>) {
    return classes.filter(Boolean).join(' ')
  }

  return (
    <>
      <Head>
        <title>Migrate Email | Postal Service - Useful Email Tools</title>
        <meta
          name="description"
          content="Our free email migration tool makes it super easy to move emails from one server to another with just a few clicks."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout title="Migrate Email">
        {successMessage && <Confetti />}
        <div className="space-y-6">
          <SourceAccountCard
            sourceServer={sourceServer}
            setSourceServer={setSourceServer}
            sourceServerError={sourceServerError}
            setSourceServerError={setSourceServerError}
            sourcePort={sourcePort}
            setSourcePort={setSourcePort}
            sourceUsername={sourceUsername}
            setSourceUsername={setSourceUsername}
            sourcePassword={sourcePassword}
            setSourcePassword={setSourcePassword}
            sourceSecure={sourceSecure}
            setSourceSecure={setSourceSecure}
          />

          <div className="my-5">
            <ArrowLongDownIcon className="mx-auto flex h-10 w-10 justify-center text-gray-400" />
          </div>

          <DestinationAccountCard
            destinationServer={destinationServer}
            setDestinationServer={setDestinationServer}
            destinationServerError={destinationServerError}
            setDestinationServerError={setDestinationServerError}
            destinationPort={destinationPort}
            setDestinationPort={setDestinationPort}
            destinationUsername={destinationUsername}
            setDestinationUsername={setDestinationUsername}
            destinationPassword={destinationPassword}
            setDestinationPassword={setDestinationPassword}
            destinationSecure={destinationSecure}
            setDestinationSecure={setDestinationSecure}
          />

          <div className="flex items-center justify-end">
            {errorMessage && (
              <p className="text-sm font-medium text-red-500">{errorMessage}</p>
            )}
            <button
              onClick={handleMigrate}
              disabled={loading || sourceServerError !== null}
              className={classNames(
                loading
                  ? 'bg-yellow-500'
                  : successMessage
                  ? 'bg-green-500'
                  : 'bg-blue-600 hover:bg-blue-700',
                'ml-3 inline-flex justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              )}
            >
              {loading ? (
                <>
                  <svg
                    className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>{' '}
                  {loadingList[loadingIndex]}
                </>
              ) : successMessage ? (
                'Migration completed!'
              ) : (
                'Start Migration'
              )}
            </button>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Migrate
