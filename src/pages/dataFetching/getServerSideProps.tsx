import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
 
export const getServerSideProps = (async () => {
  // Fetch data from external API
  const num = await fetch('https://www.random.org/integers/?num=1&min=1&max=100&col=1&base=10&format=plain&rnd=new')
  const number: number = await num.json()
  // Pass data to the page via props
  return { props: { number } }
}) satisfies GetServerSideProps<{ number: number }>
 
export default function Page({
  number,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div>
      <h1>getServerSideProps</h1>
      <h2>Number: {number}</h2>
    </div>
  )
}