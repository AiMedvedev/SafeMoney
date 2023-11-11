import { financeControl } from './financeControl.js';
import { clearChart, generateChart } from './generateChart.js';
import { reformatDate } from './helpers.js';
import { OverlayScrollbars } from './overlayscrollbars.esm.min.js';
import { deleteData, getData } from './services.js';
import { storage } from './storage.js';

const reportBtn = document.querySelector('.finance__report');
const reportScreen = document.querySelector('.report');
const reportDatesForm = document.querySelector('.report__dates');
const reportOperationList = document.querySelector('.report__operation-list');
const reportTable = document.querySelector('.report__table');
const generateChartBtn = document.querySelector('#generateChartButton')
const operationTypes = {
    income: 'доходы',
    expenses: 'расходы'
}
let actualData = [];

const closeReportScreen = ({target}) => {
    if(target.closest('.report__close') || 
    (!target.closest('.report') && target !== reportBtn)) {
        gsap.to(reportScreen, {
            opacity: 0,
            scale: 0,
            duration: .5, 
            ease: 'power2.in',
            onComplete() {
                reportScreen.style.visibility = 'hidden';
            }
        });
    
        document.removeEventListener('click', closeReportScreen);
    }
}

const openReportScreen = () => {
    reportScreen.style.visibility = 'visible';

    gsap.to(reportScreen, {
        opacity: 1,
        scale: 1,
        duration: .5, 
        ease: 'power2.out'
    });

    document.addEventListener('click', closeReportScreen);
}

const renderReport = (data) => {
    const reportRows = data.map(({category, amount, description, date, type, id}) => {
        const reportRow = document.createElement('tr'); 
        reportRow.classList.add('report__row');
        reportRow.innerHTML = `
            <td class="report__cell">${category}</td>
            <td class="report__cell" style="text-align: right">${amount.toLocaleString()}&nbsp;₽</td>
            <td class="report__cell">${description}</td>
            <td class="report__cell">${reformatDate(date)}</td>
            <td class="report__cell">${operationTypes[type]}</td>
            <td class="report__action-cell">
                  <button
                    class="report__button report__button_table" data-id="${id}">&#10006;</button>
                </td>   
        `;
        return reportRow;
    });

    reportOperationList.textContent = '';
    reportOperationList.append(...reportRows);
}

export const reportControl = () => {
    reportTable.addEventListener('click', async ({target}) => {
        const targetSort = target.closest("[data-sort]");
        console.log(target);

        if(targetSort) {
            const sortField = targetSort.dataset.sort;

            renderReport(
                [...storage.data].sort((a, b) => {
                    if(targetSort.dataset.dir === 'up') {
                        [a, b] = [b, a]
                    }

                    if(sortField === 'amount') {
                        return parseFloat(a[sortField]) < parseFloat(b[sortField]) ? -1 : 1;
                    }
                    return a[sortField] < b[sortField] ? -1 : 1;
                })
            );

            if(targetSort.dataset.dir === 'up') {
                targetSort.dataset.dir = 'down';
            } else {
                targetSort.dataset.dir = 'up';
            }
        }

        const deleteBtn = target.closest('.report__button_table');

        if(deleteBtn) {
            await deleteData(`/finance/${deleteBtn.dataset.id}`);

            const reportRow = deleteBtn.closest('.report__row');
            reportRow.remove();
            financeControl();
            clearChart();
        }
    });

    reportBtn.addEventListener('click', async () => {
        const textContent = reportBtn.textContent;
        reportBtn.textContent = 'Загрузка...';
        reportBtn.disabled = true;
        actualData = await getData("/finance");
        storage.data = actualData;
        reportBtn.textContent = textContent;
    
        reportBtn.disabled = false;
        renderReport(storage.data);
        openReportScreen();
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
        const url = queryString ? `/finance?${queryString}` : "/finance";
        actualData = await getData(url); 
    
        renderReport(actualData);
        clearChart();
    });

    generateChartBtn.addEventListener('click', () => {
        generateChart(actualData);
    });
}

OverlayScrollbars(reportScreen, {});
