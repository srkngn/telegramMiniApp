'use client';

//import { createNewCustomer, State2,  } from "@/app/lib/actions";
import { useActionState, useEffect, useState } from "react";
import { Button } from "../button";
import Link from "next/link";

interface UserDataFromTelegram {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code: string;
  is_premium: boolean;
}

interface FormProps {
  fromTelegram: UserDataFromTelegram | null;
}

export default function Form({fromTelegram}: FormProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (fromTelegram) {
      setFirstName(fromTelegram.first_name);
      setLastName(fromTelegram.last_name || '');
    }
  }, [fromTelegram]);

  const handleSubmit = async (event: React.FormEvent) => { 
    event.preventDefault();

    const formData = {
      firstName,
      lastName,
      email,
      phoneNumber
    };

    try {
      const response = await fetch('/api/createStudentInfo', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      const responseBody = await response.json();

      if (response.ok) {
        console.log('Your form has been successfully submitted');

        setNotification({message:'Your form has been successfully submitted', type: "success"})

        setFirstName('');
        setLastName('');
        setEmail('');
        setPhoneNumber('');

      } else {
        console.error('Form submission failed');
        setNotification({ message: 'System Error. Please repeat the submission.', type: 'error' });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setNotification({ message: 'System Error.', type: 'error' });
    }

  };

    //const initialState: State2 = { message: null, errors: {} };

    //const [state2, formAction] = useActionState(createNewCustomer, initialState);

    return (
      <>
      {notification && (
        <div className={`p-4 mb-4 rounded-md text-sm ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {notification.message}
        </div>
      )}
        <form onSubmit={handleSubmit}>
        <div className="rounded-md bg-gray-50 p-4 md:p-8">
            <div className="mb-4">
          <label htmlFor="firstName" className="mb-2 block text-sm font-medium">
            First Name
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                id="firstName"
                name="firstName"
                type="text"
                step="0.01"
                placeholder="First Name"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="lastName" className="mb-2 block text-sm font-medium">
            Last Name
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                id="lastName"
                name="lastName"
                type="text"
                step="0.01"
                placeholder="Last Name"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            E-Mail
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                name="email"
                type="text"
                step="0.01"
                placeholder="E-mail"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="phoneNumber" className="mb-2 block text-sm font-medium">
            Phone Number (With Country Code)
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                id="phoneNumber"
                name="phoneNumber"
                type="text"
                step="0.01"
                placeholder="Phone Number"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
          </div>
        </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
        <Button type="submit">Send</Button>
      </div>
      </form>
      </>
    );
}