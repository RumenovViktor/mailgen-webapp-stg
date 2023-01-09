import React, {useEffect, useState} from 'react'
import './App.css';
import {BrowserRouter as Router} from 'react-router-dom';
import {Auth0Provider, useAuth0} from "@auth0/auth0-react";
import history from "./utils/history";
import {getConfig} from "./config";
import LeftNavigation from "./navigation/LeftNavigation";
import {Provider as StoreProvider} from 'react-redux'
import 'antd/dist/antd.css';
import store from "./store/store";
import EmailNotVerified from "./Onboarding/EmailNotVerified";
import {callApi} from "./utils/apiHelper";
import OnboardingView from "./Onboarding/OnboardingView";

function App() {
    const config = getConfig()

    const onRedirectCallback = (appState) => {
        history.push(
            appState && appState.returnTo ? appState.returnTo : window.location.pathname
        );
    };

    const providerConfig = {
        domain: config.domain,
        clientId: config.clientId,
        ...(config.audience ? {audience: config.audience} : null),
        redirectUri: window.location.origin,
        scope: config.scope,
        onRedirectCallback
    };

    const MainView = () => {
        return <>
            <Router>
                <div className="App">
                    <LeftNavigation/>
                </div>
            </Router>
        </>
    }

    const LoadingView = () => {
        return <>
            <p>Loading...</p>
        </>
    }

    const AppStructure = () => {
        const [emailVerified, setEmailVerified] = useState(true)
        const [emailVerifiedCheckLoaded, setEmailVerifiedCheckLoaded] = useState(false)
        const [customerIdExists, setCustomerIdExists] = useState(false)
        const [customerIdLoaded, setCustomerIdLoaded] = useState(false)
        const [showLoadingView, setShowLoadingView] = useState(false)
        const {isLoading, isAuthenticated, loginWithRedirect, getIdTokenClaims, getAccessTokenSilently} = useAuth0()

        if (!isLoading && !isAuthenticated) {
            loginWithRedirect()
        }

        if (!isLoading && !isAuthenticated) {
            setShowLoadingView(true)
        }

        useEffect(() => {
            setEmailVerifiedCheckLoaded(false)
            getIdTokenClaims()
                .then(x => {
                    if (x) {
                        setEmailVerified(x["email_verified"])
                        setEmailVerifiedCheckLoaded(true)
                    }
                })
        }, [isAuthenticated])

        const getViewAfterLoading = () => {
            if (!emailVerified) {
                return <EmailNotVerified />;
            }
            
            return !customerIdExists || !customerIdLoaded ? <LoadingView /> : <MainView />;
        }

        const createCustomer = () => {
            callApi(getAccessTokenSilently, {
                url: `${process.env.REACT_APP_API_BASE}/customer/create`,
                method: 'post',
                successCallback: (response) => {
                    setCustomerIdLoaded(true)
                    if (response.id.length){
                        setCustomerIdExists(true)
                    }
                },
                errorCallback: (err) => { }
            });
        }
        
        useEffect(() => {
            if (emailVerified){
                callApi(getAccessTokenSilently, {
                    url: `${process.env.REACT_APP_API_BASE}/customer/getCustomerId`,
                    method: 'get',
                    successCallback: (response) => {
                        setCustomerIdLoaded(true)
                        if (response.id.length){
                            setCustomerIdExists(true)
                        }else{
                            createCustomer()
                        }
                    },
                    errorCallback: (err) => { }
                });
            }
        }, [])

        return <>
            {showLoadingView || !emailVerifiedCheckLoaded ? <LoadingView /> : getViewAfterLoading()}
        </>
    }

    return (
        <StoreProvider store={store}>
            <Auth0Provider {...providerConfig}>
                <AppStructure/>
            </Auth0Provider>
        </StoreProvider>
    );
}

export default App;
