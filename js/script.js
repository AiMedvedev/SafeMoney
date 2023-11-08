import { convertStringToNumber } from './convertStringToNumber.js';
import { OverlayScrollbars } from './overlayscrollbars.esm.min.js';
import { renderReport } from './renderReport.js';

const API__URL = 'https://cute-unmarred-gosling.glitch.me/api';

const financeForm = document.querySelector('.finance__form');
const financeAmount = document.querySelector('.finance__amount');
const reportBtn = document.querySelector('.finance__report');
const reportScreen = document.querySelector('.report');
const reportDatesForm = document.querySelector('.report__dates');

const closeReportScreen = ({target}) => {
    if(target.closest('.report__close') || 
    (!target.closest('.report') && target !== reportBtn)) {
        reportScreen.classList.remove('report__open');
        document.removeEventListener('click', closeReportScreen);
    }
}

const openReportScreen = () => {
    reportScreen.classList.add('report__open');
    document.addEventListener('click', closeReportScreen);
}

const getData = async (url) => {
    try {
        const response = await fetch(`${API__URL}${url}`);
        if(!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();

    } catch (error) {
        console.error("Ошибка при получении данных: ", error);
        throw error;
    }
}

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

reportBtn.addEventListener('click', async () => {
    openReportScreen();
    const data = await getData("/test");
    renderReport(data);
});

reportDatesForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = Object.fromEntries(new FormData(reportDatesForm));
    const searchParams = new URLSearchParams();

    if(formData.startDate) {
        searchParams.append('startDate', formData.startDate)
    }
    if(formData.endDate) {
        searchParams.append('endDate', formData.endDate)
    }

    const queryString = searchParams.toString();
    const url = queryString ? `/test?${queryString}` : "/test";
    const data = await getData(url); 

    renderReport(data);
});

OverlayScrollbars(reportScreen, {});
