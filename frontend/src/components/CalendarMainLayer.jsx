import React, { useEffect, useState, useRef } from 'react'; // Ajout de useRef
import Calendar from './child/Calendar';
import { INITIAL_EVENTS, createEventId } from '../hook/event-utils';
import { Icon } from '@iconify/react/dist/iconify.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

// ...reste du code...

const DatePicker = ({ id, placeholder }) => {
    const datePickerRef = useRef(null);

    useEffect(() => {
        flatpickr(datePickerRef.current, {
            enableTime: true,
            dateFormat: 'd/m/Y H:i',
        });
    }, []);

    return (
        <input
            ref={datePickerRef}
            id={id}
            type="text"
            className="form-control radius-8 bg-base"
            placeholder={placeholder}
        />
    );
};

const CalendarMainLayer = () => {
    const [events, setEvents] = useState(INITIAL_EVENTS);

    // Récupérer les factures depuis le backend
    const fetchInvoices = async () => {
        try {
            const token = localStorage.getItem('token'); // Récupérer le jeton d'authentification
            if (!token) {
                console.error('Token manquant. Veuillez vous connecter.');
                return;
            }
    
            const response = await fetch('http://localhost:5000/api/invoices/getallinvoice', {
                headers: {
                    Authorization: `Bearer ${token}`, // Ajout du jeton dans les en-têtes
                    'Content-Type': 'application/json',
                },
            });
    
            const invoices = await response.json(); // Récupérer les factures directement
            console.log('Factures récupérées :', invoices); // Log pour déboguer
    
            // Transformer les factures en événements pour le calendrier
            const invoiceEvents = invoices.map((invoice) => ({
                id: createEventId(),
                title: invoice.clientName,
                start: new Date(invoice.dueDate).toISOString(), // Assurez-vous que dueDate est au format ISO
            }));
    
            setEvents([...INITIAL_EVENTS, ...invoiceEvents]);
        } catch (error) {
            console.error('Erreur lors de la récupération des factures :', error);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    return (
        <>
            <div className="row gy-4">
                <div className="col-xxl-3 col-lg-4">
                    <div className="card h-100 p-0">
                        <div className="card-body p-24">
                            <button
                                type="button"
                                className="btn btn-primary text-sm btn-sm px-12 py-12 w-100 radius-8 d-flex align-items-center gap-2 mb-32"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal"
                            >
                                <Icon
                                    icon="fa6-regular:square-plus"
                                    className="icon text-lg line-height-1"
                                />
                                Add Currency
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col-xxl-9 col-lg-8">
                    <div className="card h-100 p-0">
                        <div className="card-body p-24">
                            <div id="wrap">
                                <div id="calendar" />
                                <div style={{ clear: 'both' }} />
                                <Calendar events={events} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CalendarMainLayer;