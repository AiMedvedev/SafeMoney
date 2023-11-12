import { animationNumber, convertStringToNumber } from './helpers.js';
import { getData, postData } from './services.js';

const financeForm = document.querySelector('.finance__form');
const financeAmount = document.querySelector('.finance__amount');

let amount = 0;
financeAmount.textContent = amount;
 
const addNewOperation = async (e) => {
    e.preventDefault();

    const typeOperation = e.submitter.dataset.typeOperation;
    const financeFormData = Object.fromEntries(new FormData(financeForm));
    financeFormData.type = typeOperation;

    const addedOperation = await postData("/finance", financeFormData);
    const changeAmount = Math.abs(convertStringToNumber(addedOperation.amount));

    if(typeOperation === 'income') {
        amount += changeAmount;
    }
    if(typeOperation === 'expenses') {
        amount -= changeAmount;
    }

    animationNumber(financeAmount, amount);
    financeForm.reset();
}

export const financeControl = async () => {
    const operations = await getData("/finance");

    amount = operations.reduce((acc, item) => {
        if(item.type === 'income') {
            acc += convertStringToNumber(item.amount);
        }
        if(item.type === 'expenses') {
            acc -= convertStringToNumber(item.amount);
        }

        return acc;
    }, 0);

    animationNumber(financeAmount, amount);
    financeForm.addEventListener('submit', addNewOperation);
}