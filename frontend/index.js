import { backend } from "declarations/backend";

// Show/hide loading spinner
const showLoading = () => document.getElementById('loadingSpinner').style.display = 'flex';
const hideLoading = () => document.getElementById('loadingSpinner').style.display = 'none';

// Load all taxpayers
async function loadTaxPayers() {
    showLoading();
    try {
        const taxpayers = await backend.getAllTaxPayers();
        const tbody = document.getElementById('taxpayersList');
        tbody.innerHTML = taxpayers.map(tp => `
            <tr>
                <td>${tp.tid}</td>
                <td>${tp.firstName}</td>
                <td>${tp.lastName}</td>
                <td>${tp.address}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading taxpayers:', error);
        alert('Failed to load taxpayers');
    } finally {
        hideLoading();
    }
}

// Add new taxpayer
document.getElementById('addTaxPayerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    showLoading();

    const taxpayer = {
        tid: document.getElementById('tid').value,
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        address: document.getElementById('address').value
    };

    try {
        await backend.addTaxPayer(taxpayer);
        document.getElementById('addTaxPayerForm').reset();
        await loadTaxPayers();
        alert('TaxPayer added successfully!');
    } catch (error) {
        console.error('Error adding taxpayer:', error);
        alert('Failed to add taxpayer');
    } finally {
        hideLoading();
    }
});

// Search taxpayer
window.searchTaxPayer = async () => {
    const tid = document.getElementById('searchTid').value;
    if (!tid) {
        alert('Please enter a TID');
        return;
    }

    showLoading();
    try {
        const taxpayer = await backend.getTaxPayer(tid);
        const resultDiv = document.getElementById('searchResult');
        
        if (taxpayer) {
            resultDiv.innerHTML = `
                <div class="alert alert-success">
                    <h6>TaxPayer Found:</h6>
                    <p>TID: ${taxpayer.tid}</p>
                    <p>Name: ${taxpayer.firstName} ${taxpayer.lastName}</p>
                    <p>Address: ${taxpayer.address}</p>
                </div>
            `;
        } else {
            resultDiv.innerHTML = `
                <div class="alert alert-warning">
                    No taxpayer found with TID: ${tid}
                </div>
            `;
        }
    } catch (error) {
        console.error('Error searching taxpayer:', error);
        alert('Failed to search taxpayer');
    } finally {
        hideLoading();
    }
};

// Refresh list function
window.refreshList = loadTaxPayers;

// Initial load
loadTaxPayers();
