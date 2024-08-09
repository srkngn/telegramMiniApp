"use client";

import Form from "@/app/ui/forms/createForm";
import { useEffect, useState } from "react";
import Head from "next/head";
import Image from 'next/image';

interface userDataFromTelegram{
  id:number;
  first_name: string;
  last_name?: string;
  username?:string;
  language_code: string;
  is_premium:boolean;
}

export default function Page () {

  const [ userDataT, setUserDataT] = useState<userDataFromTelegram | null>(null)

  useEffect(() => {
    const loadScript = (url: string) => {
      return new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Script load error for ${url}`));
        document.head.appendChild(script);
      });
    };

    loadScript('https://telegram.org/js/telegram-web-app.js')
      .then(() => {
        if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
          const webApp = window.Telegram.WebApp;
          webApp.ready();
          webApp.expand();

          const userDataT = webApp.initDataUnsafe.user;
          if (userDataT) {
            setUserDataT(userDataT as userDataFromTelegram);
          }
          console.log('currentUser',userDataT)


        } else {
          console.log('Telegram Web App script is not loaded.');
        }
      })
      .catch((error) => {
        console.error('Error loading Telegram Web App script:', error);
      });
  }, []);

    return (
    <>
      <main className="flex flex-col items-center min-h-screen p-4 box-border ">
        <header className="flex justify-center items-center p-5 w-full">
          <Image 
          src="/RoadToStudy/RoadToStudyLogo.png"
          alt="RoadToStudyLogo"
          width={800}
          height={600}
          className="h-16 w-auto"
          >
          </Image>
          
        </header>
        <div className="mb-8 text-justify text-xl max-w-full leading-6 text-white box-border">
          Are you interested in studying in Turkey? 🇹🇷  Fill out the form now to get detailed information about programs, scholarships and admission process. ✨
        </div>
        <div className="w-full max-w-full bg-gray-200 shadow-md p-6 pt-8 box-border rounded-lg">
          <Form fromTelegram={userDataT} />
        </div>
      </main>
  </>
  )
}