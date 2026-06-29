// =====================================
// JAM REALTIME
// =====================================

function updateClock() {

    const now = new Date();

    document.getElementById("clock").innerHTML =
        now.toLocaleDateString("id-ID") +
        "<br>" +
        now.toLocaleTimeString("id-ID");

}

setInterval(updateClock, 1000);

updateClock();


// =====================================
// DATA
// =====================================

let transaksi = [];

let chartPengeluaran = null;


// =====================================
// TAMBAH TRANSAKSI
// =====================================

function tambahTransaksi() {

    const tanggal =
        document.getElementById("tanggal").value;

    const kategori =
        document.getElementById("kategori").value;

    const keterangan =
        document.getElementById("keterangan").value;

    const nominal =
        document.getElementById("nominal").value;

    if (
        tanggal === "" ||
        kategori === "" ||
        keterangan === "" ||
        nominal === ""
    ) {

        alert("Lengkapi semua data terlebih dahulu!");

        return;

    }

    if (Number(nominal) <= 0) {

        alert("Nominal harus lebih dari 0");

        return;

    }

    transaksi.push({

        tanggal: tanggal,
        kategori: kategori,
        keterangan: keterangan,
        nominal: Number(nominal)

    });

    simpanData();

    tampilkanData();

    resetForm();

}


// =====================================
// RESET FORM
// =====================================

function resetForm() {

    document.getElementById("tanggal").value = "";

    document.getElementById("kategori").value = "";

    document.getElementById("keterangan").value = "";

    document.getElementById("nominal").value = "";

}


// =====================================
// TAMPILKAN DATA
// =====================================

function tampilkanData() {

    const tbody =
        document.getElementById("dataTransaksi");

    if (!tbody) return;

    tbody.innerHTML = "";

    transaksi.forEach((item, index) => {

        tbody.innerHTML += `

        <tr>

            <td>${item.tanggal}</td>

            <td>${item.kategori}</td>

            <td>${item.keterangan}</td>

            <td>
                Rp ${item.nominal.toLocaleString("id-ID")}
            </td>

            <td>

                <button onclick="editData(${index})">
                    Edit
                </button>

                <button onclick="hapusData(${index})">
                    Hapus
                </button>

            </td>

        </tr>

        `;

    });

    updateDashboard();

    updateChart();

    updateStatistikKategori();

}


// =====================================
// HAPUS DATA
// =====================================

function hapusData(index) {

    if (confirm("Yakin ingin menghapus data ini?")) {

        transaksi.splice(index, 1);

        simpanData();

        tampilkanData();

    }

}


// =====================================
// EDIT DATA
// =====================================

function editData(index) {

    document.getElementById("tanggal").value =
        transaksi[index].tanggal;

    document.getElementById("kategori").value =
        transaksi[index].kategori;

    document.getElementById("keterangan").value =
        transaksi[index].keterangan;

    document.getElementById("nominal").value =
        transaksi[index].nominal;

    transaksi.splice(index, 1);

    simpanData();

    tampilkanData();

}


// =====================================
// LOCAL STORAGE
// =====================================

function simpanData() {

    localStorage.setItem(

        "motorfiest",

        JSON.stringify(transaksi)

    );

}

function loadData() {

    const data =
        localStorage.getItem("motorfiest");

    if (data) {

        transaksi =
            JSON.parse(data);

    }

    tampilkanData();

}


// =====================================
// DASHBOARD
// =====================================

function updateDashboard() {

    let total = 0;

    let terbesar = 0;

    let kategoriCount = {};

    transaksi.forEach(item => {

        total += item.nominal;

        if (item.nominal > terbesar) {

            terbesar = item.nominal;

        }

        kategoriCount[item.kategori] =
            (kategoriCount[item.kategori] || 0)
            + item.nominal;

    });

    // Dashboard Home
    const totalElement =
        document.getElementById("totalPengeluaran");

    const jumlahElement =
        document.getElementById("jumlahTransaksi");

    const terbesarElement =
        document.getElementById("pengeluaranTerbesar");

    const kategoriElement =
        document.getElementById("kategoriTerbesar");

    if (totalElement) {

        totalElement.innerText =
            "Rp " +
            total.toLocaleString("id-ID");

    }

    if (jumlahElement) {

        jumlahElement.innerText =
            transaksi.length;

    }

    if (terbesarElement) {

        terbesarElement.innerText =
            "Rp " +
            terbesar.toLocaleString("id-ID");

    }

    let kategoriTerbesar = "-";

    let nilaiTerbesar = 0;

    for (let kategori in kategoriCount) {

        if (kategoriCount[kategori] > nilaiTerbesar) {

            nilaiTerbesar =
                kategoriCount[kategori];

            kategoriTerbesar =
                kategori;

        }

    }

    if (kategoriElement) {

        kategoriElement.innerText =
            kategoriTerbesar;

    }

    // Dashboard Laporan
    const laporanTotal =
        document.getElementById("laporanTotal");

    const laporanJumlah =
        document.getElementById("laporanJumlah");

    if (laporanTotal) {

        laporanTotal.innerText =
            "Rp " +
            total.toLocaleString("id-ID");

    }

    if (laporanJumlah) {

        laporanJumlah.innerText =
            transaksi.length;

    }

}


// =====================================
// CHART.JS
// =====================================

function updateChart() {

    const kategoriData = {};

    transaksi.forEach(item => {

        if (!kategoriData[item.kategori]) {

            kategoriData[item.kategori] = 0;

        }

        kategoriData[item.kategori] += item.nominal;

    });

    const labels =
        Object.keys(kategoriData);

    const data =
        Object.values(kategoriData);

    const canvas =
        document.getElementById("myChart");

    if (!canvas) return;

    const ctx =
        canvas.getContext("2d");

    if (chartPengeluaran) {

        chartPengeluaran.destroy();

    }

    chartPengeluaran = new Chart(ctx, {

        type: "bar",

        data: {

            labels: labels,

            datasets: [{

                label: "Total Pengeluaran",

                data: data,

                backgroundColor: [

                    "#ff6b00",
                    "#1e90ff",
                    "#28a745",
                    "#ffc107",
                    "#dc3545",
                    "#6f42c1",
                    "#20c997"

            ],

    borderWidth: 1

}]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {

                    display: true

                }

            },

            scales: {

                y: {

                    beginAtZero: true

                }

            }

        }

    });

}


// =====================================
// SEARCH TRANSAKSI
// =====================================

function cariTransaksi() {

    const keyword =
        document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    const rows =
        document.querySelectorAll(
            "#dataTransaksi tr"
        );

    rows.forEach(row => {

        const text =
            row.innerText.toLowerCase();

        if (text.includes(keyword)) {

            row.style.display = "";

        } else {

            row.style.display = "none";

        }

    });

}


// =====================================
// FILTER BULAN
// =====================================

function filterBulan() {

    const bulan =
        document.getElementById("filterBulan").value;

    const rows =
        document.querySelectorAll(
            "#dataTransaksi tr"
        );

    rows.forEach(row => {

        const tanggal =
            row.cells[0].innerText;

        if (bulan === "") {

            row.style.display = "";

        } else {

            if (tanggal.includes("-" + bulan + "-")) {

                row.style.display = "";

            } else {

                row.style.display = "none";

            }

        }

    });

}


// =====================================
// EXPORT CSV
// =====================================

function exportCSV() {

    if (transaksi.length === 0) {

        alert("Belum ada data pengeluaran!");

        return;

    }

    let csv = "Tanggal,Kategori,Keterangan,Nominal\n";

    transaksi.forEach(item => {

        csv +=
            item.tanggal + "," +
            item.kategori + "," +
            item.keterangan + "," +
            item.nominal + "\n";

    });

    const blob = new Blob(
        [csv],
        { type: "text/csv;charset=utf-8;" }
    );

    const link =
        document.createElement("a");

    const url =
        URL.createObjectURL(blob);

    link.setAttribute("href", url);

    link.setAttribute(
        "download",
        "Laporan_Pengeluaran_MotorFiest.csv"
    );

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

}


// =====================================
// EXPORT PDF
// =====================================

async function exportPDF() {

    if (transaksi.length === 0) {

        alert("Belum ada data!");

        return;

    }

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    doc.setFontSize(18);

    doc.text(
        "LAPORAN PENGELUARAN MOTOR FIEST",
        20,
        20
    );

    doc.setFontSize(10);

    let y = 40;

    let total = 0;

    transaksi.forEach(item => {

        doc.text(

            `${item.tanggal} | ${item.kategori} | ${item.keterangan} | Rp ${item.nominal.toLocaleString("id-ID")}`,

            10,

            y

        );

        y += 10;

        if (y > 270) {

            doc.addPage();

            y = 20;

}

        total += item.nominal;

    });

    y += 10;

    if (y > 270) {

        doc.addPage();

        y = 20;

}

    doc.setFontSize(12);

    doc.text(

        `Total Pengeluaran : Rp ${total.toLocaleString("id-ID")}`,

        10,

        y

    );

    doc.save(
        "Laporan_MotorFiest.pdf"
    );

}


// =====================================
// LOAD DATA AWAL
// =====================================

loadData();


// =====================================
// NAVIGASI MENU
// =====================================

const navLinks =
    document.querySelectorAll(".nav-link");

const pages =
    document.querySelectorAll(".page");

navLinks.forEach(link => {

    link.addEventListener("click", function (e) {

        e.preventDefault();

        navLinks.forEach(item => {

            item.classList.remove("active");

        });

        pages.forEach(page => {

            page.classList.remove("active-page");

        });

        this.classList.add("active");

        const pageId =
            this.dataset.page;

        document
            .getElementById(pageId)
            .classList.add("active-page");

    });

});


// =====================================
// BACKUP JSON
// =====================================

function backupData() {

    const data =
        JSON.stringify(
            transaksi,
            null,
            2
        );

    const blob =
        new Blob(
            [data],
            {
                type:
                "application/json"
            }
        );

    const link =
        document.createElement("a");

    link.href =
        URL.createObjectURL(blob);

    link.download =
        "backup_motorfiest.json";

    link.click();

}


// =====================================
// RESTORE JSON
// =====================================

function restoreData(event) {

    const file =
        event.target.files[0];

    if (!file) return;

    const reader =
        new FileReader();

    reader.onload =
        function(e) {

        try {

            transaksi =
                JSON.parse(
                    e.target.result
                );

            simpanData();

            tampilkanData();

            alert(
                "Data berhasil dipulihkan!"
            );

        }

        catch {

            alert(
                "File backup tidak valid!"
            );

        }

    };

    reader.readAsText(file);

}


// =====================================
// STATISTIK KATEGORI
// =====================================

function updateStatistikKategori() {

    const container =
        document.getElementById(
            "statistikKategori"
        );

    if (!container) return;

    container.innerHTML = "";

    if (transaksi.length === 0) {

        container.innerHTML =
            "<p>Belum ada data.</p>";

        return;

    }

    let total = 0;

    const kategoriData = {};

    transaksi.forEach(item => {

        total += item.nominal;

        kategoriData[item.kategori] =
            (kategoriData[item.kategori] || 0)
            + item.nominal;

    });

    for (let kategori in kategoriData) {

        const persen =
            (
                kategoriData[kategori]
                / total
            ) * 100;

        container.innerHTML += `

        <div class="stat-card">

            <h4>${kategori}</h4>

            <p>${persen.toFixed(1)}%</p>

        </div>

        `;

    }

}

function bukaPengeluaran(){

    document
        .querySelector(
            '[data-page="pengeluaran"]'
        )
        .click();

}