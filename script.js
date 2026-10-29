/* ==================================================
   BALANTAK UTARA
   JavaScript interactions for all pages
================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* ==============================================
       1. MOBILE NAVIGATION
    ============================================== */

    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".nav-menu");

    function closeMobileMenu() {
        if (!menuToggle || !navMenu) return;

        navMenu.classList.remove("show");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Buka navigasi");
        menuToggle.textContent = "☰";
    }

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", function () {
            const isOpen = navMenu.classList.toggle("show");

            menuToggle.setAttribute("aria-expanded", String(isOpen));
            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Tutup navigasi" : "Buka navigasi"
            );

            menuToggle.textContent = isOpen ? "✕" : "☰";
        });

        navMenu.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", closeMobileMenu);
        });

        document.addEventListener("click", function (event) {
            const clickedMenu = navMenu.contains(event.target);
            const clickedToggle = menuToggle.contains(event.target);

            if (!clickedMenu && !clickedToggle) {
                closeMobileMenu();
            }
        });

        window.addEventListener("resize", function () {
            if (window.innerWidth > 760) {
                closeMobileMenu();
            }
        });
    }


    /* ==============================================
       2. SEARCH BUTTON AND SEARCH FORM
    ============================================== */

    const searchToggle = document.querySelector(".search-toggle");
    const searchForm = document.querySelector(".search-form");

    if (searchToggle && searchForm) {
        const searchInput = searchForm.querySelector('input[type="search"]');

        searchToggle.addEventListener("click", function () {
            const isOpen = searchForm.classList.toggle("show");

            searchToggle.setAttribute("aria-expanded", String(isOpen));

            if (isOpen && searchInput) {
                searchInput.focus();
            }
        });

        searchForm.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!searchInput) return;

            const keyword = searchInput.value.trim().toLowerCase();

            if (!keyword) {
                searchInput.focus();
                return;
            }

            const searchableCards = Array.from(
                document.querySelectorAll(
                    ".package-card, .nature-card, .wildlife-card, " +
                    ".news-card, .article-card, .feature-card, " +
                    ".destination-card, .activity-card"
                )
            );

            let firstMatch = null;

            searchableCards.forEach(function (card) {
                const text = card.textContent.toLowerCase();
                const image = card.querySelector("img");
                const imageAlt = image ? image.alt.toLowerCase() : "";

                const matches =
                    text.includes(keyword) ||
                    imageAlt.includes(keyword);

                if (matches && !firstMatch) {
                    firstMatch = card;
                }
            });

            if (firstMatch) {
                firstMatch.scrollIntoView({
                    behavior: window.matchMedia(
                        "(prefers-reduced-motion: reduce)"
                    ).matches ? "auto" : "smooth",
                    block: "center"
                });

                firstMatch.classList.remove("search-highlight");

                void firstMatch.offsetWidth;

                firstMatch.classList.add("search-highlight");

                setTimeout(function () {
                    firstMatch.classList.remove("search-highlight");
                }, 2500);

                return;
            }

            const currentPage = window.location.pathname;

            const pages = [
                {
                    name: "Beranda",
                    url: "index.html",
                    keywords: ["beranda", "home", "destinasi", "maleo", "lumba-lumba"]
                },
                {
                    name: "Paket Wisata",
                    url: "paket-wisata.html",
                    keywords: ["paket", "booking", "harga", "snorkeling", "pulau", "diving", "mangrove"]
                },
                {
                    name: "Kekayaan Alam",
                    url: "kekayaan-alam.html",
                    keywords: ["alam", "flora", "fauna", "cengkeh", "kakao", "pala", "ekosistem", "kelautan"]
                },
                {
                    name: "Berita",
                    url: "berita.html",
                    keywords: ["berita", "artikel", "budaya", "lingkungan", "pertanian"]
                },
                {
                    name: "Tentang",
                    url: "tentang.html",
                    keywords: ["tentang", "profil", "lokasi", "wilayah", "peta"]
                }
            ];

            const pageMatch = pages.find(function (page) {
                return page.keywords.some(function (word) {
                    return word.includes(keyword) || keyword.includes(word);
                });
            });

            if (pageMatch && !currentPage.endsWith(pageMatch.url)) {
                window.location.href =
                    pageMatch.url + "?q=" + encodeURIComponent(keyword);
            } else {
                alert(
                    'Tidak ditemukan hasil untuk "' +
                    keyword +
                    '". Coba kata kunci lain.'
                );
            }
        });

        document.addEventListener("click", function (event) {
            const clickedToggle = searchToggle.contains(event.target);
            const clickedForm = searchForm.contains(event.target);

            if (!clickedToggle && !clickedForm) {
                searchForm.classList.remove("show");
                searchToggle.setAttribute("aria-expanded", "false");
            }
        });
    }


    /* ==============================================
       3. AUTOMATIC FOOTER YEAR
    ============================================== */

    document.querySelectorAll(".current-year").forEach(function (element) {
        element.textContent = new Date().getFullYear();
    });


    /* ==============================================
       4. SMOOTH SCROLLING
    ============================================== */

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener("click", function (event) {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                event.preventDefault();

                targetElement.scrollIntoView({
                    behavior: window.matchMedia(
                        "(prefers-reduced-motion: reduce)"
                    ).matches ? "auto" : "smooth",
                    block: "start"
                });

                if (history.replaceState) {
                    history.replaceState(null, "", targetId);
                }
            }
        });
    });


    /* ==============================================
       5. PACKAGE CATEGORY FILTER
    ============================================== */

    const packageFilters = document.querySelectorAll("[data-filter]");
    const packageCards = document.querySelectorAll(".filterable-card");

    packageFilters.forEach(function (button) {
        button.addEventListener("click", function () {
            const selectedCategory = button.dataset.filter;

            packageFilters.forEach(function (filterButton) {
                const isActive = filterButton === button;

                filterButton.classList.toggle("active", isActive);
                filterButton.setAttribute(
                    "aria-pressed",
                    String(isActive)
                );
            });

            packageCards.forEach(function (card) {
                const cardCategory = card.dataset.category;

                const shouldShow =
                    selectedCategory === "all" ||
                    cardCategory === selectedCategory;

                card.classList.toggle("is-hidden", !shouldShow);
            });
        });
    });


    /* ==============================================
       6. NEWS CATEGORY FILTER
    ============================================== */

    const newsFilters = document.querySelectorAll("[data-news-filter]");
    const newsCards = document.querySelectorAll(".article-card");

    function filterNews(category) {
        newsFilters.forEach(function (button) {
            const isActive = button.dataset.newsFilter === category;

            button.classList.toggle("active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });

        newsCards.forEach(function (card) {
            const cardCategory = card.dataset.newsCategory;

            const shouldShow =
                category === "all" ||
                cardCategory === category;

            card.classList.toggle("is-hidden", !shouldShow);
        });
    }

    newsFilters.forEach(function (button) {
        button.addEventListener("click", function () {
            filterNews(button.dataset.newsFilter);
        });
    });

    document.querySelectorAll("[data-category-link]").forEach(function (link) {
        link.addEventListener("click", function (event) {
            if (document.querySelector(".news-filters")) {
                event.preventDefault();

                filterNews(link.dataset.categoryLink);

                const newsSection = document.querySelector("#berita-terbaru");

                if (newsSection) {
                    newsSection.scrollIntoView({
                        behavior: window.matchMedia(
                            "(prefers-reduced-motion: reduce)"
                        ).matches ? "auto" : "smooth",
                        block: "start"
                    });
                }
            }
        });
    });


    /* ==============================================
       7. ARTICLE DETAIL MODAL
    ============================================== */

    const articleModal = document.querySelector("#article-modal");
    const articleReadButtons = document.querySelectorAll(".article-read");

    if (articleModal) {
        const modalImage = document.querySelector("#modal-image");
        const modalCategory = document.querySelector("#modal-category");
        const modalDate = document.querySelector("#modal-date");
        const modalTitle = document.querySelector("#modal-title");
        const modalText = document.querySelector("#modal-text");
        const modalClose = articleModal.querySelector(".modal-close");

        articleReadButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                modalTitle.textContent = button.dataset.title || "Artikel";
                modalCategory.textContent = button.dataset.category || "";
                modalDate.textContent = button.dataset.date || "";
                modalText.textContent = button.dataset.content || "";

                modalImage.src = button.dataset.image || "";
                modalImage.alt = button.dataset.title || "Gambar artikel";

                articleModal.showModal();
                document.body.classList.add("modal-open");
            });
        });

        function closeArticleModal() {
            if (articleModal.open) {
                articleModal.close();
            }

            document.body.classList.remove("modal-open");
        }

        if (modalClose) {
            modalClose.addEventListener("click", closeArticleModal);
        }

        articleModal.addEventListener("click", function (event) {
            if (event.target === articleModal) {
                closeArticleModal();
            }
        });

        articleModal.addEventListener("close", function () {
            document.body.classList.remove("modal-open");
        });
    }


    /* ==============================================
       8. BOOKING FORM
    ============================================== */

    const bookingButtons = document.querySelectorAll(".booking-btn");
    const customBookingButton = document.querySelector("[data-open-booking]");
    const bookingForm = document.querySelector("#booking-form");
    const packageSelect = document.querySelector("#booking-package");

    function openBookingForm(packageName) {
        if (!bookingForm) {
            window.location.href = "paket-wisata.html#form-booking";
            return;
        }

        if (packageSelect && packageName) {
            const options = Array.from(packageSelect.options);

            const matchingOption = options.find(function (option) {
                return option.value === packageName ||
                    option.textContent.trim() === packageName;
            });

            if (matchingOption) {
                packageSelect.value = matchingOption.value;
            } else if (packageName.toLowerCase().includes("custom")) {
                packageSelect.value = "Paket Wisata Custom";
            }
        }

        bookingForm.scrollIntoView({
            behavior: window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches ? "auto" : "smooth",
            block: "center"
        });

        const firstInput = bookingForm.querySelector('input[name="nama"]');

        if (firstInput) {
            setTimeout(function () {
                firstInput.focus({ preventScroll: true });
            }, 450);
        }
    }

    bookingButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            openBookingForm(button.dataset.package);
        });
    });

    if (customBookingButton) {
        customBookingButton.addEventListener("click", function () {
            openBookingForm(
                customBookingButton.dataset.package || "Paket Wisata Custom"
            );
        });
    }

    if (bookingForm) {
        const dateInput = bookingForm.querySelector('input[name="tanggal"]');

        if (dateInput) {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, "0");
            const day = String(today.getDate()).padStart(2, "0");

            dateInput.min = year + "-" + month + "-" + day;
        }

        bookingForm.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!bookingForm.reportValidity()) return;

            const formData = new FormData(bookingForm);

            const bookingDetails = {
                nama: formData.get("nama"),
                telepon: formData.get("telepon"),
                paket: formData.get("paket"),
                tanggal: formData.get("tanggal"),
                peserta: formData.get("peserta"),
                catatan: formData.get("catatan")
            };

            const message = [
                "PERMINTAAN INFORMASI PAKET WISATA",
                "",
                "Nama: " + bookingDetails.nama,
                "Nomor WhatsApp: " + bookingDetails.telepon,
                "Paket: " + bookingDetails.paket,
                "Tanggal rencana: " + bookingDetails.tanggal,
                "Jumlah peserta: " + bookingDetails.peserta + " orang",
                "Catatan: " + (bookingDetails.catatan || "-"),
                "",
                "Mohon informasi lebih lanjut mengenai ketersediaan, harga, dan ketentuan perjalanan."
            ].join("\n");

            /*
             * Tidak ada nomor WhatsApp pengelola yang dikonfigurasi.
             * Pesan ditampilkan agar dapat diperiksa pengguna.
             * Untuk mengaktifkan pengiriman WhatsApp, tambahkan nomor
             * resmi pengelola pada konfigurasi di bawah ini.
             */

            const WHATSAPP_NUMBER = "6282197888553";

            if (WHATSAPP_NUMBER) {
    const whatsappURL =
        "https://wa.me/" +
        WHATSAPP_NUMBER +
        "?text=" +
        encodeURIComponent(message);

    window.open(whatsappURL, "_blank");
} else {
    showBookingSummary(message);
}
        });
    }


    /* ==============================================
       9. BOOKING SUMMARY
    ============================================== */

    function showBookingSummary(message) {
        let summaryDialog = document.querySelector("#booking-summary");

        if (!summaryDialog) {
            summaryDialog = document.createElement("dialog");
            summaryDialog.id = "booking-summary";
            summaryDialog.className = "article-modal";

            summaryDialog.innerHTML = `
                <button class="modal-close" type="button" aria-label="Tutup">✕</button>
                <div class="modal-content">
                    <span class="eyebrow">PERMINTAAN PERJALANAN</span>
                    <h2>Rincian Permintaanmu.</h2>
                    <p class="booking-summary-note">
                        Periksa rincian di bawah ini. Website ini belum
                        terhubung dengan pengelola atau sistem reservasi.
                    </p>
                    <pre class="booking-summary-text"></pre>
                    <button class="btn btn-primary copy-booking" type="button">
                        Salin Rincian
                    </button>
                </div>
            `;

            document.body.appendChild(summaryDialog);

            const closeButton = summaryDialog.querySelector(".modal-close");

            closeButton.addEventListener("click", function () {
                summaryDialog.close();
            });

            summaryDialog.addEventListener("click", function (event) {
                if (event.target === summaryDialog) {
                    summaryDialog.close();
                }
            });

            summaryDialog.querySelector(".copy-booking").addEventListener(
                "click",
                async function () {
                    const summaryText = summaryDialog.querySelector(
                        ".booking-summary-text"
                    ).textContent;

                    try {
                        await navigator.clipboard.writeText(summaryText);

                        this.textContent = "Berhasil Disalin ✓";

                        setTimeout(() => {
                            this.textContent = "Salin Rincian";
                        }, 2000);
                    } catch (error) {
                        const temporaryTextArea = document.createElement("textarea");

                        temporaryTextArea.value = summaryText;
                        document.body.appendChild(temporaryTextArea);
                        temporaryTextArea.select();

                        try {
                            document.execCommand("copy");
                            this.textContent = "Berhasil Disalin ✓";
                        } catch (copyError) {
                            alert("Silakan salin rincian secara manual.");
                        }

                        temporaryTextArea.remove();
                    }
                }
            );
        }

        summaryDialog.querySelector(".booking-summary-text").textContent = message;

        summaryDialog.showModal();
    }


    /* ==============================================
       10. SEARCH HIGHLIGHT STYLE
    ============================================== */

    if (!document.querySelector("#interaction-styles")) {
        const interactionStyles = document.createElement("style");

        interactionStyles.id = "interaction-styles";

        interactionStyles.textContent = `
            .search-highlight {
                outline: 3px solid #4d9386;
                outline-offset: 4px;
                transition: outline-color 0.3s ease;
            }

            .booking-summary-text {
                white-space: pre-wrap;
                overflow-wrap: anywhere;
                padding: 16px;
                margin: 18px 0;
                border-radius: 8px;
                background: #f7f5ee;
                color: #263a32;
                font-family: "DM Sans", sans-serif;
                font-size: 12px;
                line-height: 1.9;
            }

            .booking-summary-note {
                margin-top: 12px;
                font-size: 12px;
                line-height: 1.8;
            }
        `;

        document.head.appendChild(interactionStyles);
    }


    /* ==============================================
       11. FILTER INITIALIZATION FROM URL
    ============================================== */

    const queryParams = new URLSearchParams(window.location.search);
    const searchQuery = queryParams.get("q");

    if (searchQuery) {
        const searchInput = document.querySelector(
            '.search-form input[type="search"]'
        );

        if (searchInput) {
            searchInput.value = searchQuery;
        }

        const normalizedQuery = searchQuery.toLowerCase();

        const allCards = document.querySelectorAll(
            ".package-card, .nature-card, .wildlife-card, " +
            ".news-card, .article-card, .feature-card"
        );

        let foundCard = null;

        allCards.forEach(function (card) {
            const cardText = card.textContent.toLowerCase();

            if (!foundCard && cardText.includes(normalizedQuery)) {
                foundCard = card;
            }
        });

        if (foundCard) {
            setTimeout(function () {
                foundCard.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

                foundCard.classList.add("search-highlight");

                setTimeout(function () {
                    foundCard.classList.remove("search-highlight");
                }, 2500);
            }, 300);
        }
    }
});