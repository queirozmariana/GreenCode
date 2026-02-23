document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "https://greencode.onrender.com/api";

  const upcomingEventsContainer = document.getElementById(
    "upcoming-events-container"
  );
  const pastEventsContainer = document.getElementById("past-events-container");
  const galleryWrapper = document.querySelector(
    ".galeria-swiper .swiper-wrapper"
  );
  let swiperInstance = null;

  const renderUpcomingEvents = async () => {
    try {
      const response = await fetch(`${API_URL}/events/upcoming`);
      if (!response.ok) throw new Error("Falha ao buscar próximos eventos");
      const events = await response.json();

      upcomingEventsContainer.innerHTML = "";

      events.forEach((event) => {
        const eventCardHTML = `
                    <div class="event-card">
                        <div class="event-date">
                            <span class="day">${event.dia}</span>
                            <span class="month">${event.mes}</span>
                        </div>
                        <div class="event-content">
                            <h3>${event.titulo}</h3>
                            <p><i class="fas fa-clock"></i> ${event.horario}</p>
                            <p><i class="fas fa-map-marker-alt"></i> ${event.local}</p>
                            <p>${event.descricao}</p>
                            <a href="${event.link_inscricao}" class="btn btn-primary">Inscrever-se</a>
                        </div>
                    </div>
                `;
        upcomingEventsContainer.innerHTML += eventCardHTML;
      });
    } catch (error) {
      console.error(error);
      upcomingEventsContainer.innerHTML =
        "<p>Não foi possível carregar os próximos eventos.</p>";
    }
  };

  const renderPastEvents = async () => {
    try {
      const response = await fetch(`${API_URL}/events/past`);
      if (!response.ok) throw new Error("Falha ao buscar eventos anteriores");
      const events = await response.json();

      pastEventsContainer.innerHTML = "";

      events.forEach((event) => {
        const formattedDate = new Date(event.data).toLocaleDateString("pt-BR", {
          month: "long",
          year: "numeric",
          timeZone: "UTC",
        });

        const pastEventHTML = `
                    <div class="past-event">
                        <h3>${event.nome}</h3>
                        <p>${formattedDate} - ${event.local}</p>
                        <p>${event.descricao}</p>
                    </div>
                `;
        pastEventsContainer.innerHTML += pastEventHTML;
      });
    } catch (error) {
      console.error(error);
      pastEventsContainer.innerHTML =
        "<p>Não foi possível carregar os eventos anteriores.</p>";
    }
  };

  const initializeSwiper = () => {
    if (swiperInstance) {
      swiperInstance.destroy(true, true);
    }

    swiperInstance = new Swiper(".galeria-swiper", {
      loop: true,
      spaceBetween: 20,
      slidesPerView: 1,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      },
    });
  };

  const renderGallery = async () => {
    if (!galleryWrapper) return;

    try {
      const response = await fetch(`${API_URL}/events/gallery`);
      if (!response.ok) throw new Error("Falha ao buscar a galeria");
      const galleryItems = await response.json();

      galleryWrapper.innerHTML = "";

      if (galleryItems.length === 0) {
        galleryWrapper.innerHTML =
          "<p>Nenhuma imagem na galeria no momento.</p>";
        return;
      }

      galleryItems.forEach((item) => {
        const slideHTML = `
                    <div class="swiper-slide">
                        <img src="${item.imagem}" alt="${item.titulo}" />
                        <h2>${item.titulo}</h2>
                        <p>${item.descricao}</p>
                    </div>
                `;
        galleryWrapper.innerHTML += slideHTML;
      });

      initializeSwiper();
    } catch (error) {
      console.error(error);
      galleryWrapper.innerHTML = "<p>Não foi possível carregar a galeria.</p>";
    }
  };

  renderUpcomingEvents();
  renderPastEvents();
  renderGallery();
});
