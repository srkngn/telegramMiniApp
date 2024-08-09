"use client";

import Form from "@/app/ui/forms/createForm";
import { useEffect, useState } from "react";
import Head from "next/head";
import '../styles/form.css'

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
      <main className="main-container">
        <header className="header">
          <img src="/RoadToStudy/RoadToStudyLogo.png" alt="RoadToStudyLogo" className="logo" />
        </header>
        <div className="title">
        Are you interested in studying in Turkey? 🇹🇷  Fill out the form now to get detailed information about programs, scholarships and admission process. ✨
        </div>
        <div className="form-container">
          <Form fromTelegram={userDataT}/>
        </div>
      </main>
  </>
  )
}