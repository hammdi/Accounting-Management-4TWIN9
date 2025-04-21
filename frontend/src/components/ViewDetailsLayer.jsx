import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { gapi } from 'gapi-script';

const ViewDetailsLayer = () => {
    const { emailId } = useParams(); // Récupère l'ID de l'email depuis l'URL
    const [emailDetails, setEmailDetails] = useState(null); // État pour stocker les détails de l'email
    const [loading, setLoading] = useState(true); // État de chargement

    useEffect(() => {
        const fetchEmailDetails = async () => {
            try {
                const response = await gapi.client.gmail.users.messages.get({
                    userId: 'me',
                    id: emailId,
                });

                const headers = response.result.payload.headers;
                const subject = headers.find(header => header.name === 'Subject')?.value || 'Sans objet';
                const from = headers.find(header => header.name === 'From')?.value || 'Inconnu';

                // Récupérer le contenu de l'email
                let body = '';
                if (response.result.payload.parts) {
                    const part = response.result.payload.parts.find(part => part.mimeType === 'text/plain' || part.mimeType === 'text/html');
                    if (part && part.body?.data) {
                        body = decodeURIComponent(escape(atob(part.body.data.replace(/-/g, '+').replace(/_/g, '/'))));
                    }
                } else if (response.result.payload.body?.data) {
                    body = decodeURIComponent(escape(atob(response.result.payload.body.data.replace(/-/g, '+').replace(/_/g, '/'))));
                }

                setEmailDetails({
                    subject,
                    from,
                    body,
                });
            } catch (error) {
                console.error('Erreur lors de la récupération des détails de l\'email :', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEmailDetails();
    }, [emailId]);

    if (loading) {
        return <div>Chargement...</div>;
    }

    if (!emailDetails) {
        return <div>Impossible de charger les détails de l'email.</div>;
    }

    return (
        <div className="row gy-4">
            <div className="col-xxl-12">
                <div className="card h-100 p-0 email-card">
                    <div className="card-header border-bottom bg-base py-16 px-24">
                        <h2 className="mb-0">{emailDetails.subject}</h2>
                        <p className="text-secondary-light">De : {emailDetails.from}</p>
                    </div>
                    <div className="card-body p-24">
                        <div style={{ whiteSpace: 'pre-wrap' }}>{emailDetails.body}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewDetailsLayer;