import { db } from '@/lib/firestore'
import { collection, addDoc, getDoc, doc, setDoc } from 'firebase/firestore'
import { NextApiRequest, NextApiResponse } from 'next/types'

const getUserFromFirestore = async (userId: string) => {
  const ref = doc(db, 'users', userId)
  console.log(ref)

  // return getDoc(ref)
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  const user = JSON.parse(req.body)
  // const userDoc = await getUserFromFirestore(user.email)
  // console.log(userDoc)
  // const userAlreadyExists = userDoc.exists()

  // if (!userAlreadyExists) {
  try {
    await addDoc(collection(db, 'users'), {
      id: user.email,
      avatar: user.image,
      username: user.email,
      displayName: user.name,
    })
  } catch (error) {
    let message = 'Failed to write data'
    if (error instanceof Error) message = error.message
    res.status(500).json({ error: message })
  }
  // }

  return res.status(200)
}
