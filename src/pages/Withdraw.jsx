import { Link } from "react-router-dom";
import React, { useState, useEffect } from 'react';

const PaymentForm = () => {
  const [paymentMethod, setPaymentMethod] = useState('crypto');
  const [tonWallet, setTonWallet] = useState('');
  const [tonError, setTonError] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardError, setCardError] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateTonWallet = (wallet) => {
    const tonRegex = /^EQ[a-zA-Z0-9_-]{47}$/;
    if (wallet && !tonRegex.test(wallet)) {
      return 'Неправильный адрес кошелька TON';
    }
    return '';
  };

  const validateCardNumber = (card) => {
    const cardRegex = /^\d{16}$/;
    if (card && !cardRegex.test(card)) {
      return 'Неправильный номер карты';
    }
    return '';
  };

  const checkFormValidity = () => {
    let valid = true;
    let tonErrorMessage = '';
    let cardErrorMessage = '';

    if (paymentMethod === 'crypto') {
      tonErrorMessage = validateTonWallet(tonWallet);
      valid = !tonErrorMessage;
    } else if (paymentMethod === 'card') {
      cardErrorMessage = validateCardNumber(cardNumber);
      valid = !cardErrorMessage;
    }

    setTonError(tonErrorMessage);
    setCardError(cardErrorMessage);
    setIsValid(valid);
  };

  const handleTonWalletChange = (e) => {
    setTonWallet(e.target.value);
    setSubmitted(false);
    checkFormValidity();
  };

  const handleCardNumberChange = (e) => {
    setCardNumber(e.target.value);
    setSubmitted(false);
    checkFormValidity();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    checkFormValidity();

    useEffect(() => {
      if (submitted) {
        checkFormValidity();
      }
    }, [tonWallet, cardNumber, paymentMethod, submitted]);

    const GetCardBtn = () => {

      const [response, setResponse] = useState(null);

      const get_data_card = async () => {
        if (isValid) {
          try {
            const res = await fetch('/get_data_card', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                tg_user_id: user.tgid,
                card_number: paymentMethod === 'crypto' ? tonWallet : cardNumber,
              }),
            });

            const data = await res.json();
            setResponse(data);
            if (!response.ok) {
              throw new Error('Ошибка при отправке данных');
            }
            alert('Данные успешно отправлены');
          } catch (error) {
            console.error(error);
            alert('Произошла ошибка при отправке данных');
          }
        } else {
          alert('Пожалуйста, исправьте ошибки в форме');
        }
      };

      return (
        <div>
          <button onClick={get_data_card} type="submit" disabled={!isValid} style={{ padding: '10px' }}>
            Отправить
          </button>
          {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
        </div>
      );
    };

    const GetTonBtn = () => {

      const [response, setResponse] = useState(null);

      const get_data_ton = async () => {
        if (isValid) {
          try {
            const res = await fetch('/get_data_ton', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                tg_user_id: user.tgid,
                ton_address: paymentMethod === 'crypto' ? tonWallet : cardNumber,
              }),
            });

            const data = await res.json();
            setResponse(data);
            if (!response.ok) {
              throw new Error('Ошибка при отправке данных');
            }
            alert('Данные успешно отправлены');
          } catch (error) {
            console.error(error);
            alert('Произошла ошибка при отправке данных');
          }
        } else {
          alert('Пожалуйста, исправьте ошибки в форме');
        }
      };
    };

    return (
      <div>
        <button onClick={get_data_ton} type="submit" disabled={!isValid} style={{ padding: '10px' }}>
          Отправить
        </button>
        {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
      </div>
    );
  };

  return (
    <div className="flex">
      <div className="paymentBtns">
        <button
          className="paymentBtn"
          onClick={() => setPaymentMethod('crypto')}
          style={{ backgroundColor: paymentMethod === 'crypto' ? '#007aff' : '#ffffff', color: paymentMethod === 'crypto' ? '#ffffff' : '#007aff', padding: '10px' }}
        >
          Крипта
        </button>
        <button
          className="paymentBtn"
          onClick={() => setPaymentMethod('card')}
          style={{ backgroundColor: paymentMethod === 'card' ? '#007aff' : '#ffffff', color: paymentMethod === 'card' ? '#ffffff' : '#007aff', padding: '10px' }}
        >
          Карта
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {paymentMethod === 'crypto' && (
          <div className="crypto">
            <label>Введите адрес кошелька TON:</label>
            <input
              type="text"
              value={tonWallet}
              onChange={handleTonWalletChange}
            />
            {submitted && tonError && <p style={{ color: 'red' }}>{tonError}</p>}

            <GetTonBtn />
          </div>
        )}

        {paymentMethod === 'card' && (
          <div className="card">
            <label>Введите номер карты:</label>
            <input
              type="text"
              value={cardNumber}
              onChange={handleCardNumberChange}
            />
            {submitted && cardError && <p style={{ color: 'red' }}>{cardError}</p>}

            <GetCardBtn />
          </div>
        )}
      </form>
    </div>
  );
};


const Withdraw = (props) => {
  const user = props.user;
  return (
    <>
      <header>
        <Link class="backbtn" to="/">
          <svg
            height="18"
            viewBox="0 0 10 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M0.769411 9.72446C0.410196 9.32435 0.410196 8.67565 0.769411 8.27554L7.92975 0.300081C8.28897 -0.100027 8.87137 -0.100027 9.23059 0.300081C9.5898 0.700189 9.5898 1.34889 9.23059 1.749L2.72066 9L9.23059 16.251C9.5898 16.6511 9.5898 17.2998 9.23059 17.6999C8.87137 18.1 8.28897 18.1 7.92976 17.6999L0.769411 9.72446Z"
              fill="#007AFF"
            />
          </svg>
        </Link>

        <div class="pagename">
          <svg
            height="14"
            viewBox="0 0 248 176"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.346726 44.551C0.437672 31.8045 0.963296 24.5134 4.00116 18.7065C7.23242 12.5299 12.3884 7.50824 18.7301 4.36112C25.9397 0.783325 35.3775 0.783325 54.2532 0.783325H193.561C212.437 0.783325 221.874 0.783325 229.084 4.36112C235.426 7.50824 240.582 12.5299 243.813 18.7065C246.851 24.5134 247.376 31.8045 247.467 44.551H0.346726Z"
              fill="#007AFF"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M0.327698 66.4349V123.333C0.327698 141.717 0.327698 150.909 4.00116 157.931C7.23242 164.107 12.3884 169.129 18.7301 172.276C25.9397 175.854 35.3775 175.854 54.2532 175.854H193.561C212.437 175.854 221.874 175.854 229.084 172.276C235.426 169.129 240.582 164.107 243.813 157.931C247.486 150.909 247.486 141.717 247.486 123.333V66.4349H0.327698ZM34.0312 126.615C34.0312 121.517 34.0312 118.968 34.8863 116.957C36.0266 114.276 38.2136 112.146 40.9664 111.035C43.031 110.203 45.6483 110.203 50.8829 110.203H62.1174C67.352 110.203 69.9693 110.203 72.0339 111.035C74.7866 112.146 76.9737 114.276 78.1139 116.957C78.9691 118.968 78.9691 121.517 78.9691 126.615C78.9691 131.714 78.9691 134.263 78.1139 136.274C76.9737 138.955 74.7866 141.085 72.0339 142.195C69.9693 143.028 67.352 143.028 62.1174 143.028H50.8829C45.6483 143.028 43.031 143.028 40.9664 142.195C38.2136 141.085 36.0266 138.955 34.8863 136.274C34.0312 134.263 34.0312 131.714 34.0312 126.615Z"
              fill="#007AFF"
            />
          </svg>
          Вывод
        </div>

        <div class="backbtn"></div>
      </header>
      <div class="body">
        <div class="stat">
          <h3>Статистика</h3>
          <div class="statTab">
            <div class="totalEarn">
              <p>Заработок за всё время</p>
              <span>{user.totalEarn}₽</span>
            </div>
            <div class="tasksComplete">
              <p>Выполненно заданий</p>
              <span>{user.tasksComplete}</span>
            </div>
          </div>
        </div>
        <div class="withdraw">
          <h3>Выберите способ вывода:</h3>
          <div>
            <PaymentForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default Withdraw;
