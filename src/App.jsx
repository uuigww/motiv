import { Routes, Route, Link } from 'react-router-dom';
import React, { useState, useEffect, Suspense } from 'react';
import WebApp from '@twa-dev/sdk';
const tg = window.Telegram.WebApp;

import Main from "./pages/Main";
import Friends from "./pages/Friends";
import Withdraw from "./pages/Withdraw";


const Preloader = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    return () => setVisible(false);
  }, []);

  return (
    <div className={`preloader ${visible ? 'visible' : ''}`}>
      <div className="spinner"></div>
    </div>
  );
};

function App() {
  const [user, setUser] = useState(null);

  const queryString = tg.initData;

  const parseQueryString = (queryString) => {
    const params = new URLSearchParams(queryString);
    const result = {};
    for (const [key, value] of params) {
      result[key] = key === 'user' ? JSON.parse(decodeURIComponent(value)) : decodeURIComponent(value);
    }
    return result;
  };

  const WebAppData = parseQueryString(queryString);
  let tg_user_id = WebAppData.user?.id;

  console.log(tg_user_id)

  const fetchUserData = async () => {
    try {
      const response = await fetch(`https://api.pycuk.ru/get_user_data?tg_user_id=${tg_user_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('ERROR to get user');
      }

      const data = await response.json();

      /* const data = { user_data: {
        tgid: 860752981,
        balance: 100,
        totalEarn: 999.99,
        tasksComplete: 999,
        tasks: [
          {
            id: 1,  
            title: "Подписка",
            description: "1 Подписка",
            img: "subscribe",
            cost: 1.0,
            btnTitle: "Подписаться",
            link: "https://t.me/timeacademyru",
            color: "DD3A64",
          },
          {
            id: 2,
            title: "Реакция",
            description: "2 Реакция",
            img: "emoji",
            cost: 1.0,
            btnTitle: "Поставить реакцию",
            link: "https://t.me/timeacademyru",
            color: "44D420",
          },
          {
            id: 3,
            title: "Комментарий",
            description: "3 Комментарий",
            img: "comment",
            cost: 1.0,
            btnTitle: "Написать комментарий",
            link: "https://t.me/timeacademyru",
            color: "21169A",
          },
        ],
        friends: [
          {
            tgid: 1,
            avatar: "/vlad.jpg",
            income: 15.93,
            name: "Влад",
          },
          {
            tgid: 1,
            avatar: "/bogdan.jpg",
            income: 10.38,
            name: "Богдан",
          },
          {
            tgid: 1,
            avatar: "/denis.jpg",
            income: 9.10,
            name: "Денис",
          },
          {
            tgid: 1,
            avatar: "/vlad.jpg",
            income: 15.93,
            name: "Влад",
          },
          {
            tgid: 1,
            avatar: "/bogdan.jpg",
            income: 10.38,
            name: "Богдан",
          },
          {
            tgid: 1,
            avatar: "/denis.jpg",
            income: 9.10,
            name: "Денис",
          },
          {
            tgid: 1,
            avatar: "/vlad.jpg",
            income: 15.93,
            name: "Влад",
          },
          {
            tgid: 1,
            avatar: "/bogdan.jpg",
            income: 10.38,
            name: "Богдан",
          },
          {
            tgid: 1,
            avatar: "/denis.jpg",
            income: 9.10,
            name: "Денис",
          },
        ],
      }} */

      setUser(data);

    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [tg_user_id]);

  if (user === null) {
    return <Preloader />;
  }



  return (
    <Suspense fallback={<Preloader />}>
      <Routes>
        <Route path="/" element={<Main user={user.user_data} />} />
        <Route path="/withdraw" element={<Withdraw user={user.user_data} />} />
        <Route path="/friends" element={<Friends user={user.user_data} />} />
        <Route path="*" element={<Main />} />
      </Routes>
    </Suspense>
  );
}

export default App;