import { Routes, Route, Link } from 'react-router-dom';
import React, { Suspense, lazy, useEffect, useState  } from 'react';


import Main from "./pages/Main"
import Friends from "./pages/Friends"
import Withdraw from "./pages/Withdraw"

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
  let user = {
    tgid: 1,
    balance: 666.666,
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
        link: "/",
        color: "DD3A64",
      },
      {
        id: 2,
        title: "Реакция",
        description: "2 Реакция",
        img: "emoji",
        cost: 1.0,
        btnTitle: "Поставить реакцию",
        link: "/",
        color: "44D420",
      },
      {
        id: 3,
        title: "Комментарий",
        description: "3 Комментарий",
        img: "comment",
        cost: 1.0,
        btnTitle: "Написать комментарий",
        link: "/",
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
  };

  return (
    <>
      <Suspense fallback={<Preloader />}>
        <Routes>
          <Route path="/" element={<Main user={user} />} />
          <Route path="/withdraw" element={<Withdraw user={user} />} />
          <Route path="/friends" element={<Friends user={user} />} />
          <Route path="*" element={<Main />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
