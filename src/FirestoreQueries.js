import { db } from "./firebaseConfig"
import {
  setDoc,
  doc,
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
  where,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore"

//USER COLLECTION
//Creates a user in Firestore
export const addUserInfoToFirestore = async (userId, userInfo) => {
  try {
    const userDoc = doc(db, `users/${userId}`)
    await setDoc(userDoc, userInfo)
  } catch (err) {
    console.error(err)
  }
}

//MOODS COLLECTION
//Adds a mood entry in Firestore
export const addMoodInfoToFirestore = async (moodInfo) => {
  try {
    const moodCollection = collection(db, `moods`)
    return await addDoc(moodCollection, moodInfo)
  } catch (err) {
    console.error(err)
  }
}
//Get mood entries over last 7 days.
export const queryForMoodInfo = async (userId) => {
  const today = new Date()
  const sevenDaysAgo = new Date()

  sevenDaysAgo.setDate(today.getDate() - 6)
  const moodQuery = query(
    collection(db, "moods"),
    where("userId", "==", `${userId}`),
    where("date", ">=", sevenDaysAgo),
    where("date", "<=", today),
    orderBy("date")
  )
  try {
    const querySnapshot = await getDocs(moodQuery)
    return querySnapshot
  } catch (err) {
    console.error(err)
  }
}
//Deletes a mood by moodID
export const deleteMood = async (moodId) => {
  const moodRef = doc(db, "moods", `${moodId}`)
  try {
    await deleteDoc(moodRef)
  } catch (err) {
    console.error(err)
  }
}

//TIPS COLLECTION
//Adds a mood tip into Firestore
export const addTipsInfoToFirestore = async (tipsInfo) => {
  try {
    const tipsCollection = collection(db, `tips`)
    return await addDoc(tipsCollection, tipsInfo)
  } catch (err) {
    console.error(err)
  }
}
//Gets all tips by mood
export const queryForTipsInfo = async (mood) => {
  const tipsQuery = query(
    collection(db, "tips"),
    where("mood", "==", `${mood}`)
  )
  try {
    const querySnapshot = await getDocs(tipsQuery)
    return querySnapshot
  } catch (err) {
    console.error(err)
  }
}

//MEDITATION AUDIO COLLECTION
//Gets all meditation audio in ascending order of the titles
export const queryForAudioInfo = async () => {
  const audioQuery = query(collection(db, "meditationAudios"), orderBy("title"))
  try {
    const querySnapshot = await getDocs(audioQuery)
    return querySnapshot
  } catch (err) {
    console.error(err)
  }
}

//JOURNAL ENTRIES COLLECTION
//Adds a journal entry to Firestore
export const addJournalEntry = async (entryInfo) => {
  try {
    const entryCollection = collection(db, `journalEntries`)
    return await addDoc(entryCollection, entryInfo)
  } catch (err) {
    console.error(err)
  }
}
//Gets all entries by a userId ordered by recent date
export const queryJournalEntries = async (userId) => {
  const entriesQuery = query(
    collection(db, "journalEntries"),
    where("userId", "==", `${userId}`),
    orderBy("created_on", "desc")
  )
  try {
    const querySnapshot = await getDocs(entriesQuery)
    return querySnapshot
  } catch (err) {
    console.error(err)
  }
}
//Deletes a journal entry by id
export const deleteJournalEntry = async (entryId) => {
  const entryRef = doc(db, "journalEntries", `${entryId}`)
  try {
    await deleteDoc(entryRef)
  } catch (err) {
    console.error(err)
  }
}
//Updates a journal entry by id
export const updateJournalEntry = async (entryId, fieldsToUpdate) => {
  const entryRef = doc(db, "journalEntries", `${entryId}`)
  try {
    await updateDoc(entryRef, {
      text: fieldsToUpdate.text,
      updated_on: fieldsToUpdate.updated_on,
    })
  } catch (err) {
    console.error(err)
  }
}

//POSTS COLLECTION
//Adds a post into Firestore
export const createPost = async (postInfo) => {
  try {
    const postsCollection = collection(db, `posts`)
    return await addDoc(postsCollection, postInfo)
  } catch (err) {
    console.error(err)
  }
}
//Gets all posts ordered by recent date
export const queryAllPosts = async () => {
  const postsQuery = query(
    collection(db, "posts"),
    orderBy("created_on", "desc")
  )
  try {
    const querySnapshot = await getDocs(postsQuery)
    return querySnapshot
  } catch (err) {
    console.error(err)
  }
}
//Updates like/unlike of a post by userId
export const updatePostLike = async (postToLike, userId) => {
  const postRef = doc(db, "posts", `${postToLike.id}`)
  if (!postToLike.likes.includes(userId)) {
    try {
      await updateDoc(postRef, {
        likes: arrayUnion(userId),
      })
    } catch (err) {
      console.error(err)
    }
  } else {
    try {
      await updateDoc(postRef, {
        likes: arrayRemove(userId),
      })
    } catch (err) {
      console.error(err)
    }
  }
}
//Deletes a post by postId
export const deletePost = async (postId) => {
  const postRef = doc(db, "posts", `${postId}`)
  try {
    await deleteDoc(postRef)
  } catch (err) {
    console.error(err)
  }
}

//COMMENTS COLLECTION
//Adds a comment into Firestore
export const AddCommentToFirestore = async (commentInfo) => {
  try {
    const commentsCollection = collection(db, `comments`)
    return await addDoc(commentsCollection, commentInfo)
  } catch (err) {
    console.error(err)
  }
}

//Gets all comment by postId ordered by recent date
export const queryAllComments = async (postId) => {
  const postsQuery = query(
    collection(db, "comments"),
    where("postId", "==", `${postId}`),
    orderBy("created_on", "desc")
  )
  try {
    const querySnapshot = await getDocs(postsQuery)
    return querySnapshot
  } catch (err) {
    console.error(err)
  }
}

//Deletes a comment by commentId
export const deleteComment = async (commentId) => {
  const commentRef = doc(db, "comments", `${commentId}`)
  try {
    await deleteDoc(commentRef)
  } catch (err) {
    console.error(err)
  }
}
