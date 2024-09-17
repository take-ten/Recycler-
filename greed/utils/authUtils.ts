import { getAuth, signInWithCredential, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { signInStart, signInSuccess, signInFailure, setUserId, setRole } from '../store/authSlice';
import { useDispatch } from 'react-redux';

export const handleFirebaseAuth = async (googleCredential: any, dispatch: any, navigation: any) => {
  dispatch(signInStart());
  try {
    const result = await signInWithCredential(getAuth(), googleCredential);
    const firebaseUser = result.user;

    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        token: googleCredential.idToken,
        displayName: firebaseUser.displayName,
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL
      });
      navigation.navigate('RoleScreen', { userId: firebaseUser.uid, googleCredential });
    } else {
      await setDoc(doc(db, 'users', firebaseUser.uid), { token: googleCredential.idToken }, { merge: true });
      dispatch(signInSuccess({
        uid: firebaseUser.uid,
        displayName: firebaseUser.displayName,
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL
      }));
      dispatch(setUserId(firebaseUser.uid));
    }
  } catch (error) {
    dispatch(signInFailure(error.message));
  }
};

export const handleEmailPasswordSignIn = async (email, password, dispatch, navigation) => {
  dispatch(signInStart());
  try {
    const result = await signInWithEmailAndPassword(getAuth(), email, password);
    const user = result.user;
    const userDoc = await getDoc(doc(db, 'users', user.uid));

    if (userDoc.exists()) {
      const userData = userDoc.data();
      dispatch(signInSuccess({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      }));
      dispatch(setUserId(user.uid));
      navigation.navigate(userData.role === 'Provider' ? 'ProviderDef' : 'CollectorDef');
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    dispatch(signInFailure(error.message));
  }
};

export const handleEmailPasswordSignUp = async (email, password, username, dispatch, navigation) => {
  dispatch(signInStart());
  try {
    const result = await createUserWithEmailAndPassword(getAuth(), email, password);
    const user = result.user;
    await setDoc(doc(db, 'users', user.uid), {
      displayName: username,
      uid: user.uid,
      email: user.email,
      photoURL: null,
      role: null,
      location: null,
      status: null,
      geolocation: null,
      phone: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      points: 0,
    });
    dispatch(signInSuccess({
      uid: user.uid,
      email: user.email,
      displayName: username,
      photoURL: null
    }));
    dispatch(setUserId(user.uid));
    navigation.navigate('RoleScreen', { userId: user.uid });
  } catch (error) {
    dispatch(signInFailure(error.message));
  }
};
