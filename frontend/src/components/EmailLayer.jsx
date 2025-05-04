import React, { useEffect, useState } from 'react';
import { gapi } from 'gapi-script';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

const GmailLayer = () => {
    const [emails, setEmails] = useState([]);
    const [filteredEmails, setFilteredEmails] = useState([]);
    const [nextPageToken, setNextPageToken] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [filterByHamdi, setFilterByHamdi] = useState(false);

    const extractEmailAddress = (fromHeader) => {
        const match = fromHeader.match(/<(.+)>/);
        return match ? match[1] : fromHeader;
    };

    const fetchEmails = async (pageToken = null) => {
  

        setLoading(true);
        try {
            const response = await gapi.client.gmail.users.messages.list({
                userId: 'me',
                maxResults: 50,
                pageToken: pageToken,
            });
            if (response.status === 200) {
                const messages = response.result.messages || [];
                setNextPageToken(response.result.nextPageToken || null);

                const emailDetails = await Promise.all(
                    messages.map(async (message) => {
                        const email = await gapi.client.gmail.users.messages.get({
                            userId: 'me',
                            id: message.id,
                        });
                        const headers = email.result.payload.headers;
                        const subject = headers.find(header => header.name === 'Subject')?.value || 'Sans objet';
                        const from = headers.find(header => header.name === 'From')?.value || 'Inconnu';
                        console.log("FROM HEADER:", from); // 👈 LOG correctement ici
                        return { id: message.id, threadId: message.threadId, subject, from };
                    })
                    
                );
            
                setEmails(prevEmails => [...prevEmails, ...emailDetails]);

                if (filterByHamdi) {
                    setFilteredEmails(prev => [
                        ...prev,
                        ...emailDetails.filter(email =>
                            extractEmailAddress(email.from) === 'Mehdi.BenAttaya@esprit.tn'
                            // hamdikbaier8@gmail.com
                        )
                    ]);
                }
            } else {
          
                console.error('Erreur lors de la récupération des emails :', response);
            }
        } catch (error) {
         
            console.error('Erreur lors de la récupération des emails :', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleHamdiFilter = () => {
        if (filterByHamdi) {
            setFilterByHamdi(false);
            setFilteredEmails([]);
        } else {
            setFilterByHamdi(true);
            const filtered = emails.filter(email =>
                
                extractEmailAddress(email.from) === 'Mehdi.BenAttaya@esprit.tn'
                // hamdikbaier8@gmail.com
            );
            setFilteredEmails(filtered);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const authInstance = gapi.auth2.getAuthInstance();
            await authInstance.signIn({ prompt: 'select_account' });
            const isSignedIn = authInstance.isSignedIn.get();
            if (isSignedIn) {
                setIsSignedIn(true);
                fetchEmails();
            } else {
                console.error('Utilisateur non connecté.');
            }
        } catch (error) {
            console.error('Erreur lors de la connexion Google :', error);
        }
    };

    const handleGoogleSignOut = () => {
        const authInstance = gapi.auth2.getAuthInstance();
        authInstance.signOut().then(() => {
            authInstance.disconnect();
            setIsSignedIn(false);
            setEmails([]);
            setFilteredEmails([]);
            setNextPageToken(null);
            setFilterByHamdi(false);
            console.log('Utilisateur déconnecté et autorisation révoquée.');
        }).catch(error => {
            console.error('Erreur lors de la déconnexion :', error);
        });
    };

    useEffect(() => {
        const initClient = () => {
            gapi.client.init({
                apiKey: 'AIzaSyCtFRSeZcqKNmmCzqMixnczP_8xDq6do40',
                clientId: '647602570641-0k81fdfm2n38rlb97ahilteksl1t6ftc.apps.googleusercontent.com',
                discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest'],
                scope: 'https://www.googleapis.com/auth/gmail.readonly',
            }).then(() => {
                const authInstance = gapi.auth2.getAuthInstance();
                const isSignedIn = authInstance.isSignedIn.get();
                setIsSignedIn(isSignedIn);
                if (isSignedIn) {
                    fetchEmails();
                }
            }).catch(error => {
                console.error('Erreur lors de l\'initialisation de gapi :', error);
            });
        };

        gapi.load('client:auth2', initClient);
    }, []);

    const loadMoreEmails = () => {
        if (nextPageToken) {
            fetchEmails(nextPageToken);
        }
    };

    const emailsToDisplay = filterByHamdi ? filteredEmails : emails;

    return (
        <div className="row gy-4">
            <div className="col-xxl-3">
                <div className="card h-100 p-0">
                    <div className="card-body p-24">
                        {!isSignedIn ? (
                            <button
                                type="button"
                                className="btn btn-primary text-sm btn-sm px-12 py-12 w-100 radius-8 d-flex align-items-center gap-2 mb-16"
                                onClick={handleGoogleSignIn}
                            >
                                <Icon icon="mdi:google" className="icon text-lg line-height-1" />
                                Se connecter avec Google
                            </button>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    className="btn btn-danger text-sm btn-sm px-12 py-12 w-100 radius-8 d-flex align-items-center gap-2 mb-16"
                                    onClick={handleGoogleSignOut}
                                >
                                    <Icon icon="mdi:logout" className="icon text-lg line-height-1" />
                                    Se déconnecter
                                </button>
                                <button
                                    type="button"
                                    className={`btn text-sm btn-sm px-12 py-12 w-100 radius-8 d-flex align-items-center gap-2 mb-16 ${filterByHamdi ? 'btn-success' : 'btn-secondary'}`}
                                    onClick={toggleHamdiFilter}
                                >
                                    <Icon
                                        icon={filterByHamdi ? "mdi:filter-check" : "mdi:filter"}
                                        className="icon text-lg line-height-1"
                                    />
                                    {filterByHamdi ? 'Filtre Hamdi activé' : 'Filtrer par important'}
                                    
                                </button>
                            </>
                        )}
                        <div className="mt-16">
                            <ul>
                                <li className="item-active mb-4">
                                    <Link
                                        to="/email"
                                        className="bg-hover-primary-50 px-12 py-8 w-100 radius-8 text-secondary-light"
                                    >
                                        <span className="d-flex align-items-center gap-10 justify-content-between w-100">
                                            <span className="d-flex align-items-center gap-10">
                                                <span className="icon text-xxl line-height-1 d-flex">
                                                    <Icon icon="uil:envelope" className="icon line-height-1" />
                                                </span>
                                                <span className="fw-semibold">Inbox</span>
                                            </span>
                                            <span className="fw-medium">{emailsToDisplay.length}</span>
                                        </span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-xxl-9">
                <div className="card h-100 p-0 email-card">
                    <div className="card-body p-0">
                        <ul className="overflow-x-auto">
                            {emailsToDisplay.map((email) => (
                                <li
                                    key={email.id}
                                    className="email-item px-24 py-16 d-flex gap-4 align-items-center border-bottom cursor-pointer bg-hover-neutral-200 min-w-max-content"
                                >
                                    <div className="form-check style-check d-flex align-items-center">
                                        <input className="form-check-input radius-4 border border-neutral-400" type="checkbox" />
                                    </div>
                                    <button type="button" className="starred-button icon text-xl text-secondary-light line-height-1 d-flex">
                                        <Icon icon="ph:star" className="icon-outline line-height-1" />
                                        <Icon icon="ph:star-fill" className="icon-fill line-height-1 text-warning-600" />
                                    </button>
                                    <Link
                                        to={`/view-details/${email.id}`}
                                        className="text-primary-light fw-medium text-md text-line-1 w-190-px"
                                    >
                                        {email.from}
                                    </Link>
                                    <Link
                                        to={`/view-details/${email.id}`}
                                        className="text-primary-light fw-medium mb-0 text-line-1 max-w-740-px"
                                    >
                                        {email.subject}
                                    </Link>
                                    <span className="text-primary-light fw-medium min-w-max-content ms-auto">
                                        Thread ID: {email.threadId}
                                    </span>
                                </li>
                            ))}
                        </ul>
                        {nextPageToken && !filterByHamdi && (
                            <div className="text-center py-16">
                                <button
                                    onClick={loadMoreEmails}
                                    className="btn btn-secondary text-sm px-16 py-8"
                                    disabled={loading}
                                >
                                    {loading ? 'Chargement...' : 'Charger plus'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GmailLayer;
