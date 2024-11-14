import {
  FC,
  useState,
  useEffect,
  createContext,
  useContext,
  useRef,
  Dispatch,
  SetStateAction,
} from 'react'
import {LayoutSplashScreen} from '../../../../_metronic/layout/core'
import {AuthModel, UserModel} from './_models'
import * as authHelper from './AuthHelpers'
import {getUserByToken} from './_requests'
import {WithChildren} from '../../../../_metronic/helpers'
import { useAppDispatch } from '@/store/hooks'
import { initialize, logout } from '@/modules/auth/store/action'
import { useNavigate } from 'react-router'

type AuthContextProps = {
  auth: AuthModel | undefined
  saveAuth: (auth: AuthModel | undefined) => void
  currentUser: UserModel | undefined
  setCurrentUser: Dispatch<SetStateAction<UserModel | undefined>>
  logout: () => void
}

const initAuthContextPropsState = {
  auth: authHelper.getAuth(),
  saveAuth: () => {},
  currentUser: undefined,
  setCurrentUser: () => {},
  logout: () => {},
}

const AuthContext = createContext<AuthContextProps>(initAuthContextPropsState)

const useAuth = () => {
  return useContext(AuthContext)
}

const AuthProvider: FC<WithChildren> = ({children}) => {
  const [auth, setAuth] = useState<AuthModel | undefined>(authHelper.getAuth())
  const [currentUser, setCurrentUser] = useState<UserModel | undefined>()
  const saveAuth = (auth: AuthModel | undefined) => {
    setAuth(auth)
    if (auth) {
      authHelper.setAuth(auth)
    } else {
      authHelper.removeAuth()
    }
  }

  const logout = () => {
    saveAuth(undefined)
    setCurrentUser(undefined)
  }

  return (
    <AuthContext.Provider value={{auth, saveAuth, currentUser, setCurrentUser, logout}}>
      {children}
    </AuthContext.Provider>
  )
}

const AuthInit: FC<WithChildren> = ({children}) => {
  const {auth, setCurrentUser} = useAuth()
  const didRequest = useRef(false)
  const nav = useNavigate();
  const [showSplashScreen, setShowSplashScreen] = useState(true)
  const d = useAppDispatch();
  // We should request user by authToken (IN OUR EXAMPLE IT'S API_TOKEN) before rendering the application
  useEffect(() => {
    const unauthorized = () => {
      d(logout())
      nav('/login')
    }
    const requestUser = async () => {
      try {
        await d(initialize());
        // if (!didRequest.current) {
        //   const {data} = await getUserByToken(apiToken)
        //   if (data) {
        //     setCurrentUser(data)
        //   }
        // }
        document.addEventListener('unauthorized', unauthorized)
      } catch (error) {
        console.error(error)
        // d(logout())
        if (!didRequest.current) {
          d(logout())
        }
      } finally {
        setShowSplashScreen(false)
      }

      return () => (didRequest.current = true)
    }

    // if (auth && auth.api_token) {
    requestUser()
    // } else {
    //   logout()
    //   setShowSplashScreen(false)
    // }
    // eslint-disable-next-line
    return () => {
      document.removeEventListener('unauthorized', unauthorized)
    }
  }, [])

  return showSplashScreen ? <LayoutSplashScreen /> : <>{children}</>
}

export {AuthProvider, AuthInit, useAuth}
