
const reportChart = document.querySelector('.report__chart');
let myChart;

export const generateChart = (data) => {
    const incomeData = data.filter(item => item.type === 'income');
    const expensesData = data.filter(item => item.type === 'expenses');

    const chartLabel = [...new Set(data.map(item => item.date))];

    const reducedOperationsPerDate = (dataArray) =>
        chartLabel.reduce(
            (acc, date, i) => {
            const total = dataArray
                .filter(item => item.date === date)
                .reduce((acc, record) => acc + parseFloat(record.amount), 0);
            if(i) {
                acc.push(acc[acc.length - 1] + total);
            } else {
                acc.push(total);
            }
            return acc;
        }, []);

    const incomeAmount = reducedOperationsPerDate(incomeData);
    const expensesAmount = reducedOperationsPerDate(expensesData);

    const balanceAmount = incomeAmount.map(
        (income, i) => income - expensesAmount[i]
    );
    const canvasChart = document.createElement('canvas');
    clearChart();
    reportChart.append(canvasChart);

    const ctx = canvasChart.getContext('2d');

    if(myChart instanceof Chart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: chartLabel,
            datasets: [
                {
                    label: "Доходы", 
                    data: incomeAmount, 
                    borderWidth: 2, 
                    hidden: false
                },
                {
                    label: "Расходы", 
                    data: expensesAmount, 
                    borderWidth: 2, 
                    hidden: false
                },
                {
                    label: "Баланс", 
                    data: balanceAmount, 
                    borderWidth: 2, 
                    hidden: false
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginsAtZero: true
                }
            },
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: "График финансов"
                },
                legend: {
                    position: 'top'
                }
            }
        }
    });
}

export const clearChart = () => {
    reportChart.textContent = '';
}