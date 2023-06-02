'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};
const account5 = {
  owner: 'Syed Mohsin ali',
  movements: [1000, -577, 6888, 75000, -20, 100, -700, -50, 9990],
  interestRate: 0.1,
  pin: 5555,
};

const accounts = [account1, account2, account3, account4, account5];

// Elements
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');

const signUpModal = document.querySelector('.signup-modal');
const signUpOverlay = document.querySelector('.signup-overlay');

const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const closeSignUpModal = document.querySelector('.close-signup-modal');
const btnSignUp = document.querySelector('.signup__btn');
const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');
const btnCloseModal = document.querySelector('.close-modal');
const btnTryAgain = document.querySelector('.try-again');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovments = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type} ">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov} €</div>
   </div>
    
   `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const updateUi = function (acc) {
  //display movements
  displayMovments(acc.movements);

  //display balance
  calcDisplaybalance(acc);

  //display summary
  calcDisplaySummary(acc);
};

//show Error modal
const showErrorModal = function () {
  allUsernames.includes(inputLoginUsername.value)
    ? (document.querySelector('.errorMessage').textContent = 'Incorrect Pin ❌')
    : (document.querySelector('.errorMessage').textContent =
        'Account does not exist');

  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

//close error modal
const closeErrorModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
//show sign up Modal
const showSignUpModal = function () {
  signUpModal.classList.remove('hidden');
  signUpOverlay.classList.remove('hidden');
};
//hide sign up Modal
const hideSignUpModal = function () {
  signUpModal.classList.add('hidden');
  signUpOverlay.classList.add('hidden');
};

const calcDisplaybalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur);

  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (acc) {
  const inCome = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov);
  labelSumIn.textContent = `${inCome}€`;

  const outgoings = Math.abs(
    acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov)
  );
  labelSumOut.textContent = `${outgoings}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposits => (deposits * acc.interestRate) / 100)
    .filter(deposits => deposits >= 1)
    .reduce((acc, deposits) => acc + deposits);
  labelSumInterest.textContent = `${interest}€`;
};

const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUserName(accounts);

////

const allUsernames = accounts.map(acc => acc.username);

////

// Event handlers
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //display UI and Welcome message
    labelWelcome.textContent = `Welcome,${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    //clear Input Fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    updateUi(currentAccount);
  } else {
    //wrong username or pin error
    showErrorModal();
  }

  btnCloseModal.addEventListener('click', function () {
    closeErrorModal();
  });
  overlay.addEventListener('click', closeErrorModal);
  btnTryAgain.addEventListener('click', closeErrorModal);
});

// New account feature(sign up) //
//

btnSignUp.addEventListener('click', function (e) {
  e.preventDefault();
  showSignUpModal();
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    updateUi(currentAccount);
  }
  inputLoanAmount.value = '';
});

closeSignUpModal.addEventListener('click', hideSignUpModal);

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recevierAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    currentAccount.balance >= amount &&
    recevierAcc &&
    amount > 0 &&
    recevierAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    recevierAcc.movements.push(amount);

    //update UI
    updateUi(currentAccount);
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
  }
  inputClosePin.value = inputCloseUsername.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovments(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
/*
//Slice

const arr = ['a', 'b', 'c', 'd', 'e'];
console.log(arr);

console.log(arr.slice(2));
console.log(arr);

console.log(arr.slice(3, 4));

console.log(arr.slice(-1));
console.log(arr.slice(-3));

// splice

// console.log(arr.splice(2));
console.log(arr);
// console.log(arr.splice(-1));
arr.splice(1, 3);
console.log(arr);

// Reverse //

const array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
console.log(array);
array.reverse();
console.log(array);
array.reverse();
console.log(array);

// Concat //

const arr1 = [1, 2, 3, 4, 5];
const arr2 = [6, 7, 8, 9, 10];

console.log(arr1.concat(arr2));
console.log([...arr1, ...arr2].join('_'));

// join

console.log(arr1.join('_'), arr2.join('_'));




const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const movement of movements) {
for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement: ${i + 1} You have deposited ${movement}`);
  } else {
    console.log(`Movement:${i + 1} You withdrew ${Math.abs(movement)}`);
  }
}

console.log('_____________forEach______________ ');

movements.forEach(function (movement, i, arr) {
  if (movement > 0) {
    console.log(`Movement: ${i + 1} You have deposited ${movement}`);
  } else {
    console.log(`Movement: ${i + 1} You withdrew ${Math.abs(movement)}`);
  }
});

// Data 1:
const juliaData = [3, 5, 2, 12, 7];
const kateData = [4, 1, 15, 8, 3];

//  Data 2:

// const juliaData = [9, 16, 6, 8, 3];
// const kateData = [10, 5, 6, 1, 4];

const checkDogs = function (dogsJulia, dogsKate) {
  const dogsJuliaCorrect = dogsJulia.slice(1, 3);
  
  const dogsTotalData = dogsJuliaCorrect.concat(dogsKate);
  
  dogsTotalData.forEach((age, i) => {
    if (age >= 3) {
      console.log(`Dog number ${i + 1} is an adult, and is ${age} years old`);
    } else {
      console.log(`Dog number ${i + 1} is still puppy🐶`);
    }
  });
};
checkDogs(juliaData, kateData);



const euroToUsd = 1.1;

const movementsUsd = movements.map(function (mov) {
  return mov * euroToUsd;
});
console.log(movementsUsd);

//for

const movementsUsdFor = [];
for (const mov of movements) movementsUsdFor.push(mov * euroToUsd);

console.log('========');

console.log(movementsUsdFor);

console.log('========');

const movementsUsdarrow = movements.map(mov => mov * euroToUsd);
console.log(movementsUsdarrow);

const movementsDescirption = movements.map(
  (mov, i) =>
    `Movement: ${i + 1} You have ${mov > 0 ? 'deposit' : 'withdrewel'} ${mov}`
);
console.log(movementsDescirption);

const withdrawals = movements.filter(mov => mov < 0);
console.log(withdrawals);

const depositFor = [];

for (const movement of movements) {
  if (movement > 0) {
    depositFor.push(movement);
  }
}
console.log(depositFor);


const balance = movements.reduce((acc, cur, i, arr) => {
  console.log(`iterration ${i}: ${acc}`);
  return acc + cur;
}, 0);
console.log(balance);

console.log('====for====');

let balanceFor = 0;
for (const [i, mov] of movements.entries()) {
  balanceFor += mov;
  console.log(`interation ${i} : ${balanceFor}`);
}


const max = movements.reduce(function (acc, mov) {
  console.log(`acc: ${acc}${acc > mov ? '  > ' : '  < '}  Mov: ${mov}`);

  if (mov > acc) return mov;
  else return acc;
}, movements[0]);
console.log(max);


//coding challenge #3

const calcAverageHumanAge = arr =>
  arr
    .map((age, i) => (age <= 2 ? age * 2 : 16 + age * 4))
    .filter(age => age >= 18)
    .reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
const ss = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
console.log(ss);


const firstWithDrawal = movements.find(mov => mov < 0);
console.log(firstWithDrawal);

const account = accounts.find(
  account => account.owner === 'Steven Thomas Williams'
);

console.log(account);

for (const accountFor of accounts) {
  if (accountFor.owner === 'Steven Thomas Williams') console.log(accountFor);
}


///
//random numbers
const int = Math.abs(Math.random() * 3).toFixed(1);
console.log(int);
///
///


//some

console.log(movements);

console.log(movements.includes(200));

const anyDeposit = movements.some(mov => mov > 0);

console.log(anyDeposit);

//every

console.log(movements.every(mov => mov > 0));
console.log(account4.movements.every(mov => mov > 0));



const arr = [[1, [2, 3]], [, [4, 5], 6], 7, 8];

console.log(arr.flat(2));

const totalBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(totalBalance);

const owners = ['moshin ', 'ali ', 'bilal', 'zaid'];
console.log(owners);
console.log(owners.sort());
console.log(movements);

console.log(movements.sort());

// movements.sort((a, b) => (a > b ? 1 : -1));
// console.log(movements);
// movements.sort((a, b) => (a > b ? -1 : 1));
// console.log(movements);

movements.sort((a, b) => a - b);
console.log(movements);
movements.sort((a, b) => b - a);
console.log(movements);
*/
