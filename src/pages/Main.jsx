import { Link } from "react-router-dom";
import React, { useState } from "react";
import "../index.css";


function Balance(props) {
  return (
    <div className="balance">
      <h3>Баланс</h3>
      <h1>
        <p>{props.balance}</p>
        <span>₽</span>
      </h1>
    </div>
  );
}

const complete_quest = async (tg_user_id, quest_id) => {
  try {
    const res = await fetch('https://api.pycuk.ru/complete_quest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tg_user_id: tg_user_id,
        quest_id: quest_id,
      }),
    });

    const data = await res.json();
    return data; // Возвращаем данные, чтобы обновить баланс
  } catch (error) {
    console.error('Error:', error);
  }
};

function Main(props) {

  const [user, setUser] = useState(props.user);
  const [isOpen, setIsOpen] = useState(false);
  const [taskInfo, setTaskInfo] = useState(null);
  const [isClicked, setLinkClick] = useState(false);
  const [checkBtnStyle, setCheckBtnStyle] = useState({ background: "#73b4f8" });

  const handleButtonClick = (info) => {
    setTaskInfo(info);
    setIsOpen(true);
  };

  const closeContainer = () => {
    setIsOpen(false);
    setTaskInfo(null);
  };

  const handleOverlayClick = (e) => {
    if (e.target.className === "overlay open") {
      closeContainer();
    }
  };

  const handleLinkClick = () => {
    setLinkClick(true);
    setCheckBtnStyle({ background: "#007aff" })
  }

  const handleCompleteQuest = async () => {
    if (taskInfo && isClicked) {
      const response = await complete_quest(user.tgid, taskInfo.id);

      console.log(response)

      if (response.status == "success") {
        try {
          const response = await fetch(`https://api.pycuk.ru/get_user_data?tg_user_id=${user.tgid}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          /* if (!response.ok) {
            throw new Error('ERROR to get user');
          } */

          const data = await response.json();

          console.log(data)

          setUser(data.user_data);
          closeContainer();


        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    }
  };

  function TaskList(props) {

    const tasks = props.tasks.map((task) => {
      let style = { boxShadow: "0px 4px 5px 0px rgba(0, 0, 0, 0.2)" };
      if (task.color) {
        style.boxShadow = `inset 8px 0px 0px 0px #${task.color}, 0px 4px 5px 0px rgba(0, 0, 0, 0.2)`;
        style.padding = "0 11px 0 17px";
      }
      return (
        <button
          key={task.id}
          onClick={() => handleButtonClick(task)}
          className="task"
          style={style}
        >
          <div>
            <img src={task.img + ".png"} alt={task.title} />
            <span className="title">{task.title}</span>
          </div>
          <span className="cost">{task.cost.toFixed(2)}₽</span>
        </button>
      );
    });

    return <div className="TaskList">{tasks}</div>;
  }

  return (
    <div className="body Main">
      <div className={`content ${isOpen ? "blur" : ""}`}>
        <Balance balance={user.balance} />
        <div className="buttons">
          <Link to="/withdraw" className="page">
            <span>Вывод</span>
          </Link>
          <Link to="/friends" className="page">
            <span>Друзья</span>
          </Link>
        </div>

        {user.tasks.length == 0 ? (
          <div className="noTasks">
            <h3 className="availableTasks">Доступных заданий нет</h3>
            <p>Возвращайтесь немного попозже 🙂</p>
          </div>
        ) : (
          <h3 className="availableTasks">Доступные задания</h3>
        )}

        <TaskList tasks={user.tasks} />
      </div>

      {isOpen && <div className="overlay open" onClick={handleOverlayClick} />}
      <div className={`container ${isOpen ? "open" : ""}`}>
        {taskInfo && (
          <>
            <img src={taskInfo.img + ".gif"} alt={taskInfo.title} />
            <h2>{taskInfo.title}</h2>
            <p>{taskInfo.description}</p>
            <a className="taskLink" href={taskInfo.link} onClick={handleLinkClick}>
              {taskInfo.btnTitle}
            </a>
            {<button
              className="taskLink"
              onClick={handleCompleteQuest}
              disabled={!isClicked}
              style={checkBtnStyle}
            >
              Проверить
            </button>}
          </>
        )}
      </div>
    </div>
  );
}

export default Main;
