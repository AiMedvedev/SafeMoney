import { convertStringToNumber } from './convertStringToNumber.js';
import { OverlayScrollbars } from './overlayscrollbars.esm.min.js';

const financeForm = document.querySelector('.finance__form');
const financeAmount = document.querySelector('.finance__amount');
const reportBtn = document.querySelector('.finance__report');
const reportScreen = document.querySelector('.report');
const reportCloseBtn = document.querySelector('.report__close');


let amount = 0;
financeAmount.textContent = amount;

financeForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const typeOperation = e.submitter.dataset.typeOperation;
    const changeAmount = Math.abs(convertStringToNumber(financeForm.amount.value));

    if(typeOperation === 'income') {
        amount += changeAmount;
    }

    if(typeOperation === 'expenses') {
        amount -= changeAmount;
    }

    financeAmount.textContent = `${amount.toLocaleString()} ₽`;
});

reportBtn.addEventListener('click', () => {
    reportScreen.classList.add('report__open');
});

reportScreen.addEventListener('click', (e) => {
    

    if(e.target === reportCloseBtn) {
        reportScreen.classList.remove('report__open');
        
    }
});

OverlayScrollbars(reportScreen, {});

