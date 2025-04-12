//Для админки
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname === '/admin/login') {
        document.getElementById('loginForm').addEventListener('submit', function(event) {
            event.preventDefault();
    
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
    
            fetch('/admin/login', {
                method: 'POST',  // Используем POST-запрос
                headers: {
                    'Content-Type': 'application/json',  // Указываем, что данные будут в формате JSON
                },
                body: JSON.stringify({ email, password })  // Отправляем данные в формате JSON
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = '/admin';  // Если авторизация успешна, перенаправляем
                } else {
                    document.getElementById('error-message').style.display = 'block';  // Если ошибка
                    console.error('Ошибка авторизации:', data.message);  // Логируем сообщение об ошибке
                }
            })
            .catch(error => {
                console.error('Ошибка при отправке запроса:', error);  // Логируем ошибку при отправке запроса
                document.getElementById('error-message').style.display = 'block';  // Показать сообщение об ошибке
            });
        });
    }

    if (window.location.pathname === '/admin') {
        function setupTagRemoval() {
            const selectedTagsContainers = document.querySelectorAll('.selected-tags');
    
            selectedTagsContainers.forEach(selectedTagsContainer => {
                selectedTagsContainer.addEventListener('click', (event) => {
                    if (event.target && event.target.classList.contains('tag')) {
                        const tag = event.target;
                        tag.remove();
                    }
                });
            });
        }
        setupTagRemoval();
    }
});

function showContent(contentId) {
    const contents = document.querySelectorAll('.content');
    contents.forEach(content => content.style.display = 'none');

    const targetContent = document.getElementById(contentId);
    targetContent.style.display = 'block';

    if (contentId === 'applications-content') {
        loadCompanies(); // Загружаем данные при активации раздела
    }

    if (contentId === 'new-applications-content') {
        loadNewCompanies(); // Загружаем данные при активации раздела
    }

    if (contentId === 'edit-applications-content' || contentId === 'existing-companies-content') {
        resetCompany(); // Очистка данных для редактирования заявок
    }
}

function loadCompanies() {
    fetch('/get_Companies')
        .then(response => response.json())
        .then(companies => {
            const tableBody = document.getElementById('table-body');
            tableBody.innerHTML = ''; // Очищаем старые данные

            if (companies.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="20">Нет данных</td></tr>`;
                return;
            }

            companies.forEach(company => {
                const row = `
                    <tr>
                        <td>${company.name}</td>
                        <td>${company.type}</td>
                        <td>${company.inn}</td>
                        <td>${company.short_description || 'Нет данных'}</td>
                        <td>${company.full_description || 'Нет данных'}</td>
                        <td>${company.products || 'Нет данных'}</td>
                        <td>${company.main_logo_url || 'Нет данных'}</td>
                        <td>${company.logo_url || 'Нет данных'}</td>
                        <td>${company.photo_1 || 'Нет фото'}</td>
                        <td>${company.photo_2 || 'Нет фото'}</td>
                        <td>${company.photo_3 || 'Нет фото'}</td>
                        <td>${company.video || 'Нет видео'}</td>
                        <td>${company.region}</td>
                        <td>${company.address}</td>
                        <td>${company.phone}</td>
                        <td>${company.telegram || 'Нет ссылки'}</td>
                        <td>${company.vk || 'Нет ссылки'}</td>
                        <td>${company.rutube || 'Нет ссылки'}</td>
                        <td>${company.dzen || 'Нет ссылки'}</td>
                        <td>${company.website || 'Нет ссылки'}</td>
                    </tr>`;
                tableBody.innerHTML += row;
            });
        })
        .catch(error => console.error('Ошибка загрузки данных:', error));
}

function loadNewCompanies() {
    fetch('/get_newCompanies')
        .then(response => response.json())
        .then(companies => {
            const tableBody = document.getElementById('table-body-new');
            tableBody.innerHTML = ''; // Очищаем старые данные

            if (companies.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="20">Нет данных</td></tr>`;
                return;
            }

            companies.forEach(company => {
                const row = `
                    <tr>
                        <td>${company.name}</td>
                        <td>${company.type}</td>
                        <td>${company.inn}</td>
                        <td>${company.short_description || 'Нет данных'}</td>
                        <td>${company.full_description || 'Нет данных'}</td>
                        <td>${company.products || 'Нет данных'}</td>
                        <td>${company.main_logo_url || 'Нет данных'}</td>
                        <td>${company.logo_url || 'Нет данных'}</td>
                        <td>${company.photo_1 || 'Нет фото'}</td>
                        <td>${company.photo_2 || 'Нет фото'}</td>
                        <td>${company.photo_3 || 'Нет фото'}</td>
                        <td>${company.video || 'Нет видео'}</td>
                        <td>${company.region}</td>
                        <td>${company.address}</td>
                        <td>${company.phone}</td>
                        <td>${company.telegram || 'Нет ссылки'}</td>
                        <td>${company.vk || 'Нет ссылки'}</td>
                        <td>${company.rutube || 'Нет ссылки'}</td>
                        <td>${company.dzen || 'Нет ссылки'}</td>
                        <td>${company.website || 'Нет ссылки'}</td>
                    </tr>`;
                tableBody.innerHTML += row;
            });
        })
        .catch(error => console.error('Ошибка загрузки данных:', error));
}

function searchCompany() {
    const companyName = document.getElementById("company-name").value;
    const attribute = document.getElementById("attribute-select").value;

    if (!companyName) {
        alert("Пожалуйста, введите название компании.");
        return;
    }

    if (companyName && attribute !== "Ничего") {
        fetch(`/search_Company`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                company_name: companyName,
                attribute: attribute
            })
        })
        .then(response => response.json())
        .then(data => {
            if (attribute !== "") {
                const dbValue = data[attribute] || "Нет данных";
                document.getElementById("db-data").value = dbValue;
            }
            if (data.is_in_registry !== undefined) {
                document.getElementById("reg-1").checked = data.is_in_registry === 1;
            } else {
                document.getElementById("reg-1").checked = false;
            }

            if (data.is_specializing_in_ai !== undefined) {
                document.getElementById("ai-1").checked = data.is_specializing_in_ai === 1;
            } else {
                document.getElementById("ai-1").checked = false;
            }

            const fields = data.field ? data.field.split(';') : [];
            const tagsContainerFields = document.getElementById("selected-tags-6");
            tagsContainerFields.innerHTML = '';
            fields.forEach(field => {
                const tag = document.createElement("div");
                tag.classList.add("tag");
                tag.textContent = field.trim();
                tagsContainerFields.appendChild(tag);
            });

            const softwareClasses = data.softwareclasses ? data.softwareclasses.split(';') : [];
            const tagsContainerSoftware = document.getElementById("selected-tags-2");
            tagsContainerSoftware.innerHTML = '';
            softwareClasses.forEach(className => {
                const tag = document.createElement("div");
                tag.classList.add("tag");
                tag.textContent = className.trim();
                tagsContainerSoftware.appendChild(tag);
            });

            const hardwareClasses = data.hardwareclasses ? data.hardwareclasses.split(';') : [];
            const tagsContainerHardware = document.getElementById("selected-tags-3");
            tagsContainerHardware.innerHTML = '';
            hardwareClasses.forEach(className => {
                const tag = document.createElement("div");
                tag.classList.add("tag");
                tag.textContent = className.trim();
                tagsContainerHardware.appendChild(tag); 
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else {
        alert("Пожалуйста, заполните все поля.");
    }
}


function searchNewCompany() {
    const companyName = document.getElementById("newcompany-name").value;
    const attribute = document.getElementById("attribute-select-new").value;

    if (!companyName) {
        alert("Пожалуйста, введите название компании.");
        return;
    }

    let requestBody = { company_name: companyName };

    if (attribute !== "") {
        requestBody.attribute = attribute;
    }

    fetch(`/search_newCompany`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    })
    .then(response => response.json())
    .then(data => {
        if (attribute !== "") {
            const dbValue = data[attribute] || "Нет данных";
            document.getElementById("db-data-new").value = dbValue;
        }

        if (data.is_in_registry !== undefined) {
            document.getElementById("reg").checked = data.is_in_registry === 1;
        }
        if (data.is_specializing_in_ai !== undefined) {
            document.getElementById("ai").checked = data.is_specializing_in_ai === 1;
        }

        const fields = data.field ? data.field.split(';') : [];
        const tagsContainerFields = document.getElementById("selected-tags-5");
        tagsContainerFields.innerHTML = '';

        fields.forEach(field => {
            const tag = document.createElement("div");
            tag.classList.add("tag");
            tag.textContent = field.trim();
            tagsContainerFields.appendChild(tag);
        });

        const softwareClasses = data.softwareclasses ? data.softwareclasses.split(';') : [];
        const tagsContainerSoftware = document.getElementById("selected-tags-1");
        tagsContainerSoftware.innerHTML = '';

        softwareClasses.forEach(className => {
            const tag = document.createElement("div");
            tag.classList.add("tag");
            tag.textContent = className.trim();
            tagsContainerSoftware.appendChild(tag);
        });

        const hardwareClasses = data.hardwareclasses ? data.hardwareclasses.split(';') : [];
        const tagsContainerHardware = document.getElementById("selected-tags-4");
        tagsContainerHardware.innerHTML = '';

        hardwareClasses.forEach(className => {
            const tag = document.createElement("div");
            tag.classList.add("tag");
            tag.textContent = className.trim();
            tagsContainerHardware.appendChild(tag); 
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function approveCompany() {
    const companyName = document.getElementById('newcompany-name').value;

    if (!companyName) {
        alert('Пожалуйста, укажите название компании');
        return;
    }

    fetch('/approve_newCompany', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ company_name: companyName })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);  // Показываем сообщение об успешном добавлении
        } else {
            alert('Ошибка: ' + data.error);  // Показываем ошибку
        }
    })
    .catch(error => {
        console.error('Ошибка:', error);
        alert('Произошла ошибка при запросе.');
    });
}

function updateCompany() {
    const companyName = document.getElementById("company-name").value;
    const attribute = document.getElementById("attribute-select").value;

    if (!companyName) {
        alert("Пожалуйста, введите название компании.");
        return;
    }

    let requestBody = { company_name: companyName };

    if (attribute !== "") {
        const dbDataValue = document.getElementById("db-data").value;
        if (dbDataValue) {
            requestBody[attribute] = dbDataValue;
        }
    }

    const isInRegistry = document.getElementById("reg-1").checked ? 1 : 0;
    const isSpecializingInAI = document.getElementById("ai-1").checked ? 1 : 0;

    requestBody.is_in_registry = isInRegistry;
    requestBody.is_specializing_in_ai = isSpecializingInAI;

    const fields = Array.from(document.getElementById("selected-tags-6").children).map(tag => tag.textContent);
    requestBody.field = fields.join('; ');

    const softwareClasses = Array.from(document.getElementById("selected-tags-2").children).map(tag => tag.textContent);
    requestBody.softwareclasses = softwareClasses.join('; ');

    const hardwareClasses = Array.from(document.getElementById("selected-tags-3").children).map(tag => tag.textContent);
    requestBody.hardwareclasses = hardwareClasses.join('; ');

    fetch('/update_Company', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Данные успешно обновлены!');
        } else {
            alert(data.message || 'Неизвестная ошибка');
        }
    })
    .catch(error => {
        console.error('Ошибка запроса:', error);
        alert('Произошла ошибка при обновлении данных.');
    });
}


function updateNewCompany() {
    const companyName = document.getElementById("newcompany-name").value;
    const attribute = document.getElementById("attribute-select-new").value;

    if (!companyName) {
        alert("Пожалуйста, введите название компании.");
        return;
    }

    let requestBody = { company_name: companyName };

    if (attribute !== "") {
        const dbDataValue = document.getElementById("db-data-new").value;
        if (dbDataValue) {
            requestBody[attribute] = dbDataValue;
        }
    }

    const isInRegistry = document.getElementById("reg").checked ? 1 : 0;
    const isSpecializingInAI = document.getElementById("ai").checked ? 1 : 0;

    requestBody.is_in_registry = isInRegistry;
    requestBody.is_specializing_in_ai = isSpecializingInAI;

    const fields = Array.from(document.getElementById("selected-tags-5").children).map(tag => tag.textContent);
    requestBody.field = fields.join('; ');

    const softwareClasses = Array.from(document.getElementById("selected-tags-1").children).map(tag => tag.textContent);
    requestBody.softwareclasses = softwareClasses.join('; ');

    const hardwareClasses = Array.from(document.getElementById("selected-tags-4").children).map(tag => tag.textContent);
    requestBody.hardwareclasses = hardwareClasses.join('; ');

    fetch('/update_newCompany', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Данные успешно обновлены!');
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Ошибка запроса:', error);
        alert('Произошла ошибка при обновлении данных.');
    });
}

function deleteCompany() {
    const companyName = document.getElementById("company-name").value;

    if (!companyName) {
        alert("Пожалуйста, введите название компании.");
        return;
    }

    fetch('/delete_Company', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ company_name: companyName })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
        } else if (data.error) {
            alert(data.error);
        }
    })
    .catch(error => {
        console.error('Ошибка:', error);
        alert("Произошла ошибка при удалении компании.");
    });
}

function deleteNewCompany() {
    const companyName = document.getElementById("newcompany-name").value;

    if (!companyName) {
        alert("Пожалуйста, введите название компании.");
        return;
    }

    fetch('/delete_newCompany', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ company_name: companyName })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
        } else if (data.error) {
            alert(data.error);
        }
    })
    .catch(error => {
        console.error('Ошибка:', error);
        alert("Произошла ошибка при удалении компании.");
    });
}

function resetCompany() {
    document.querySelectorAll('input[type="text"]').forEach(input => {
        input.value = '';
    });

    document.querySelectorAll('select').forEach(select => {
        select.value = '';
    });

    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });

    document.querySelectorAll('.selected-tags').forEach(tags => {
        tags.innerHTML = '';
    });

}



//Обработчик ПО название класса
function clickPONAME() {
    const searchInput = document.getElementById('search-input-1');
    const dropdownList = document.getElementById('dropdown-list-1');
    const selectedTagsContainer = document.getElementById('selected-tags-1');
    const dropdown = document.getElementById('dropdown-1');
    const noResults = document.getElementById('no-results-1');

    const listItemsNameClassPO = [
        "Парсеры и семантические анализаторы",
        "Средства автоматизированного перевода",
        "Средства проверки правописания",
        "Средства распознавания и синтеза речи",
        "Средства распознавания символов",
        "Средства речевого перевода",
        "Электронные словари",
        "Информационные системы для решения специфических отраслевых задач",
        "Программное обеспечение для оформления воздушных перевозок",
        "Программное обеспечение для решения отраслевых задач в области водоснабжения",
        "Программное обеспечение для решения отраслевых задач в области гостиничного и туристического бизнеса, предприятий общественного питания",
        "Программное обеспечение для решения отраслевых задач в области государственного управления",
        "Программное обеспечение для решения отраслевых задач в области добычи полезных ископаемых",
        "Программное обеспечение для решения отраслевых задач в области жилищно-коммунального хозяйства",
        "Программное обеспечение для решения отраслевых задач в области здравоохранения",
        "Программное обеспечение для решения отраслевых задач в области информации и связи",
        "Программное обеспечение для решения отраслевых задач в области культуры, спорта, организации досуга и развлечений",
        "Программное обеспечение для решения отраслевых задач в области обрабатывающего производства",
        "Программное обеспечение для решения отраслевых задач в области образования",
        "Программное обеспечение для решения отраслевых задач в области пожарной безопасности",
        "Программное обеспечение для решения отраслевых задач в области рекламы",
        "Программное обеспечение для решения отраслевых задач в области сельского, лесного хозяйства, рыболовства",
        "Программное обеспечение для решения отраслевых задач в области строительства зданий и инженерных сооружений",
        "Программное обеспечение для решения отраслевых задач в области торговли",
        "Программное обеспечение для решения отраслевых задач в области транспорта",
        "Программное обеспечение для решения отраслевых задач в области трудоустройства и подбора персонала",
        "Программное обеспечение для решения отраслевых задач в области финансовой деятельности и банковского сектора",
        "Программное обеспечение для решения отраслевых задач в области энергетики и нефтегазовой отрасли",
        "Браузеры",
        "Коммуникационное программное обеспечение",
        "Органайзеры",
        "Офисные пакеты",
        "Программное обеспечение средств внутреннего электронного документооборота",
        "Почтовые приложения",
        "Программы для обмена мгновенными сообщениями",
        "Редакторы мультимедиа",
        "Редакторы презентаций",
        "Средства просмотра",
        "Табличные редакторы",
        "Текстовые редакторы",
        "Файловые менеджеры",
        "Базы знаний",
        "Геоинформационные и навигационные средства (GIS)",
        "Дополнительные программные модули: плагины",
        "Игры и развлечения",
        "Интеллектуальные средства разработки и управления стандартами и нормативами",
        "Интеллектуальные средства управления экспертной деятельностью",
        "Мультимедийное программное обеспечение",
        "Поисковые средства",
        "Специализированное программное обеспечение органов исполнительной власти Российской Федерации, государственных корпораций, компаний и юридических лиц с преимущественным участием Российской Федерации для внутреннего использования",
        "Справочно-правовые системы",
        "Средства интеллектуальной обработки информации и интеллектуального анализа бизнес-процессов",
        "Средства мониторинга и управления программно-определяемых сетей и виртуализации сетевых функций",
        "Средства управления диалоговыми роботами: чат-боты и голосовые роботы",
        "Средства управления контактными центрами",
        "Средства управления проектами",
        "Программное обеспечение для автоматизации зданий и управления обслуживанием объектов (BAS, BMS, FM)",
        "Программное обеспечение промышленной диагностики оборудования или систем оборудования",
        "Программное обеспечение управления выездным сервисным обслуживанием (FSM)",
        "Программное обеспечение управляемых логических контроллеров (PLC)",
        "Программы для создания цифровых двойников производственного оборудования и систем, инфраструктурных объектов и готовых изделий (DT)",
        "Программы производственного планирования (APS)",
        "Программы технического обслуживания и ремонта (CMMS)",
        "Программы управления жизненным циклом сервисного обслуживания",
        "Программы человеко-машинных интерфейсов на производстве (HMI)",
        "Средства автоматизированного проектирования (CAD)",
        "Средства автоматизированного проектирования для радиоэлектроники и электротехники (ECAD, EDA)",
        "Средства автоматизированного управления техникой",
        "Средства инженерного анализа (САЕ)",
        "Средства интегрированной логистической поддержки изделия (ILS)",
        "Средства информационного моделирования зданий и сооружений, архитектурно-строительного проектирования (BIM, AEC CAD)",
        "Средства технологической подготовки производства (САРР)",
        "Средства управления жизненным циклом изделия (PLM)",
        "Средства управления инженерными данными об изделии (PDM)",
        "Средства управления оборудованием с числовым программным управлением (САМ)",
        "Средства управления процессами и данными компьютерного моделирования (SPDM)",
        "Средства управления требованиями (RMS)",
        "Средства усовершенствованного управления технологическими процессами (APC, RTO)",
        "Универсальные машиностроительные средства автоматизированного проектирования (MCAD)",
        "Драйверы",
        "Мобильная операционная система",
        "Операционные системы общего назначения",
        "Операционные системы реального времени",
        "Программы обслуживания",
        "Серверное и связующее программное обеспечение",
        "Сетевая операционная система",
        "Системы контейнеризации и контейнеры",
        "Средства виртуализации",
        "Средства мониторинга и управления",
        "Средства обеспечения облачных и распределенных вычислений",
        "Средства управления базами данных",
        "Средства хранения данных",
        "Инструменты извлечения и трансформации данных (ETL)",
        "Инструменты обработки, анализа и распознавания изображений",
        "Предметно-ориентированные информационные базы данных (EDW)",
        "Программы виртуальной и дополненной реальности",
        "Средства аналитической обработки в реальном времени (OLAP)",
        "Средства интеллектуального анализа данных (Data Mining)",
        "Средства поддержки принятия решений (DSS)",
        "Межсетевые экраны",
        "Средства автоматизации процессов информационной безопасности",
        "Средства администрирования и управления жизненным циклом ключевых носителей",
        "Средства антивирусной защиты",
        "Средства выявления и предотвращения целевых атак",
        "Средства гарантированного уничтожения данных",
        "Средства защиты виртуальных сред",
        "Средства защиты каналов передачи данных, в том числе криптографическими методами",
        "Средства защиты от несанкционированного доступа к информации",
        "Средства защиты почтовых систем",
        "Средства защиты сервисов онлайн-платежей и дистанционного банковского обслуживания",
        "Средства защиты систем промышленной автоматизации (автоматизированных систем управления технологическими процессами)",
        "Средства криптографической защиты информации и электронной подписи",
        "Средства обнаружения и предотвращения утечек информации",
        "Средства обнаружения и/или предотвращения вторжений (атак)",
        "Средства обнаружения угроз и расследования сетевых инцидентов",
        "Средства резервного копирования",
        "Средства управления доступом к информационным ресурсам",
        "Средства управления событиями информационной безопасности",
        "Средства фильтрации негативного контента",
        "Средства математического и имитационного моделирования",
        "Средства обработки Больших Данных (BigData)",
        "Средства обработки и анализа геологических и геофизических данных",
        "Средства управления информационными ресурсами и средства управления основными данными (ECM, MDM)",
        "Библиотеки подпрограмм (SDK)",
        "Интегрированные платформы для создания приложений",
        "Мобильные платформы для разработки и управления мобильными приложениями",
        "Системы предотвращения анализа и восстановления исполняемого кода программ",
        "Средства анализа исходного кода на закладки и уязвимости",
        "Средства версионного контроля исходного кода",
        "Средства обратной инженерии кода программ",
        "Средства подготовки исполнимого кода",
        "Средства разработки программного обеспечения на основе квантовых технологий",
        "Средства разработки программного обеспечения на основе нейротехнологий и искусственного интеллекта",
        "Среды разработки, тестирования и отладки",
        "Программное обеспечение для функционирования системы юридически значимого электронного документооборота",
        "Программы автоматизированного контроля качества (CAQ)",
        "Программы управления заказами (ОМ)",
        "Системы роботизации процессов (RPA)",
        "Средства управления ИТ-службой, ИТ-инфраструктурой и ИТ-активами (ITSM-ServiceDesk, SCCM, Asset Management)",
        "Средства управления бизнес-процессами (ВРМ)",
        "Средства управления лабораторными потоками работ и документов (LIMS)",
        "Средства управления основными фондами предприятия (ЕАМ)",
        "Средства управления отношениями с клиентами (CRM)",
        "Средства управления производственными процессами (MES)",
        "Средства управления складом и цепочками поставок (WMS, SCM)",
        "Средства управления содержимым (CMS), сайты и портальные решения",
        "Средства управления технологическими процессами (АСУ ТП, SCADA)",
        "Средства управления эффективностью предприятия (СРМ/ЕРМ)",
        "Средства финансового менеджмента, управления активами и трудовыми ресурсами (ERP)",
        "Средства централизованного управления конечными устройствами",
        "Средства электронной коммерции (ecommerce platform)",
        "Встроенное микропрограммное обеспечение искусственного интеллекта",
        "Встроенные прикладные программы",
        "Встроенные системные программы-операционные системы",
        "Встроенные системные программы: BIOS, UEFI и иные встроенные системные программы",
        "Программное обеспечение интернета вещей, робототехники и сенсорики",
        "Геоинформационные и навигационные системы (GIS)",
        "Информационные системы для решения специфических отраслевых задач",
        "Лингвистическое программное обеспечение",
        "Офисные приложения",
        "Поисковые системы",
        "Прикладное программное обеспечение общего назначения",
        "Системы сбора, хранения, обработки, анализа, моделирования и визуализации массивов данных",
        "Системы управления проектами, исследованиями, разработкой, проектированием и внедрением",
        "Системы управления процессами организации",
        "Специализированное программное обеспечение органов исполнительной власти Российской Федерации, государственных корпораций, компаний и юридических лиц с преимущественным участием Российской Федерации для внутреннего использования",
        "Операционные системы",
        "Серверное и связующее программное обеспечение",
        "Системы мониторинга и управления",
        "Системы управления базами данных",
        "Средства обеспечения информационной безопасности",
        "Средства обеспечения облачных и распределенных вычислений, средства виртуализации и системы хранения данных",
        "Утилиты и Драйверы",
        "Библиотеки подпрограмм (SDK)",
        "Системы анализа исходного кода на закладки и уязвимости",
        "Средства версионного контроля исходного кода",
        "Средства подготовки исполнимого кода",
        "Среды разработки, тестирования и отладки",
        "BIOS и иное встроенное программное обеспечение",
        "Встроенное программное обеспечение телекоммуникационного оборудования"
    ];


    function populateDropdown() {
        const filter = searchInput.value.toUpperCase();
        dropdownList.innerHTML = '';
        const sortedItems = listItemsNameClassPO
            .map(region => {
                const matchIndex = region.toUpperCase().indexOf(filter);
                if (matchIndex !== -1) {
                    const beforeMatch = region.substring(0, matchIndex);
                    const matchText = region.substring(matchIndex, matchIndex + filter.length);
                    const afterMatch = region.substring(matchIndex + filter.length);
                    return {
                        region,
                        itemHtml: beforeMatch + '<span class="highlight">' + matchText + '</span>' + afterMatch,
                        matchIndex
                    };
                }
                return { region, matchIndex: -1 };
            })
            .filter(item => item.matchIndex !== -1)
            .sort((a, b) => a.matchIndex - b.matchIndex);

        sortedItems.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = item.itemHtml;
            li.setAttribute('data-value', item.region);
            li.addEventListener('click', () => {
                addTag(item.region);
                searchInput.value = '';
            });
            dropdownList.appendChild(li);
        });

        noResults.style.display = sortedItems.length ? 'none' : 'block';
    }

    function addTag(value) {
        if (value && !isTagSelected(value)) {
            const tag = document.createElement('div');
            tag.className = 'tag';
            tag.textContent = value;
            tag.addEventListener('click', () => {
                tag.remove();
                updateDropdown();
                updateSearchInput();
            });
            selectedTagsContainer.appendChild(tag);
            updateDropdown();
            updateSearchInput();
        }
    }

    function isTagSelected(value) {
        return Array.from(selectedTagsContainer.getElementsByClassName('tag'))
            .some(tag => tag.textContent === value);
    }

    function updateSearchInput() {
        const tags = Array.from(selectedTagsContainer.getElementsByClassName('tag'));
        searchInput.value = tags.map(tag => tag.textContent).join(' ');
    }

    function toggleDropdownVisibility(isVisible) {
        dropdown.style.display = isVisible ? 'block' : 'none';
        const icon = document.getElementById('dropdown-icon-1');
        if (isVisible) {
            icon.classList.add('rotate');
        } else {
            icon.classList.remove('rotate');
        }
    }

    searchInput.addEventListener('focus', () => {
        populateDropdown();
        toggleDropdownVisibility(true);
    });

    searchInput.addEventListener('input', () => {
        populateDropdown();
    });

    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const inputValue = searchInput.value.trim();
            if (inputValue) {
                selectFirstMatchingRegion(inputValue);
                searchInput.value = '';
            }
        }
    });

    document.addEventListener('click', (event) => {
        if (!searchInput.contains(event.target) && !dropdown.contains(event.target)) {
            toggleDropdownVisibility(false);
        }
    });

    populateDropdown();
    toggleDropdownVisibility(true);
}
function clickPONAME2() {
    const searchInput = document.getElementById('search-input-2');
    const dropdownList = document.getElementById('dropdown-list-2');
    const selectedTagsContainer = document.getElementById('selected-tags-2');
    const dropdown = document.getElementById('dropdown-2');
    const noResults = document.getElementById('no-results-2');

    const listItemsNameClassPO = [
        "Парсеры и семантические анализаторы",
        "Средства автоматизированного перевода",
        "Средства проверки правописания",
        "Средства распознавания и синтеза речи",
        "Средства распознавания символов",
        "Средства речевого перевода",
        "Электронные словари",
        "Информационные системы для решения специфических отраслевых задач",
        "Программное обеспечение для оформления воздушных перевозок",
        "Программное обеспечение для решения отраслевых задач в области водоснабжения",
        "Программное обеспечение для решения отраслевых задач в области гостиничного и туристического бизнеса, предприятий общественного питания",
        "Программное обеспечение для решения отраслевых задач в области государственного управления",
        "Программное обеспечение для решения отраслевых задач в области добычи полезных ископаемых",
        "Программное обеспечение для решения отраслевых задач в области жилищно-коммунального хозяйства",
        "Программное обеспечение для решения отраслевых задач в области здравоохранения",
        "Программное обеспечение для решения отраслевых задач в области информации и связи",
        "Программное обеспечение для решения отраслевых задач в области культуры, спорта, организации досуга и развлечений",
        "Программное обеспечение для решения отраслевых задач в области обрабатывающего производства",
        "Программное обеспечение для решения отраслевых задач в области образования",
        "Программное обеспечение для решения отраслевых задач в области пожарной безопасности",
        "Программное обеспечение для решения отраслевых задач в области рекламы",
        "Программное обеспечение для решения отраслевых задач в области сельского, лесного хозяйства, рыболовства",
        "Программное обеспечение для решения отраслевых задач в области строительства зданий и инженерных сооружений",
        "Программное обеспечение для решения отраслевых задач в области торговли",
        "Программное обеспечение для решения отраслевых задач в области транспорта",
        "Программное обеспечение для решения отраслевых задач в области трудоустройства и подбора персонала",
        "Программное обеспечение для решения отраслевых задач в области финансовой деятельности и банковского сектора",
        "Программное обеспечение для решения отраслевых задач в области энергетики и нефтегазовой отрасли",
        "Браузеры",
        "Коммуникационное программное обеспечение",
        "Органайзеры",
        "Офисные пакеты",
        "Программное обеспечение средств внутреннего электронного документооборота",
        "Почтовые приложения",
        "Программы для обмена мгновенными сообщениями",
        "Редакторы мультимедиа",
        "Редакторы презентаций",
        "Средства просмотра",
        "Табличные редакторы",
        "Текстовые редакторы",
        "Файловые менеджеры",
        "Базы знаний",
        "Геоинформационные и навигационные средства (GIS)",
        "Дополнительные программные модули: плагины",
        "Игры и развлечения",
        "Интеллектуальные средства разработки и управления стандартами и нормативами",
        "Интеллектуальные средства управления экспертной деятельностью",
        "Мультимедийное программное обеспечение",
        "Поисковые средства",
        "Специализированное программное обеспечение органов исполнительной власти Российской Федерации, государственных корпораций, компаний и юридических лиц с преимущественным участием Российской Федерации для внутреннего использования",
        "Справочно-правовые системы",
        "Средства интеллектуальной обработки информации и интеллектуального анализа бизнес-процессов",
        "Средства мониторинга и управления программно-определяемых сетей и виртуализации сетевых функций",
        "Средства управления диалоговыми роботами: чат-боты и голосовые роботы",
        "Средства управления контактными центрами",
        "Средства управления проектами",
        "Программное обеспечение для автоматизации зданий и управления обслуживанием объектов (BAS, BMS, FM)",
        "Программное обеспечение промышленной диагностики оборудования или систем оборудования",
        "Программное обеспечение управления выездным сервисным обслуживанием (FSM)",
        "Программное обеспечение управляемых логических контроллеров (PLC)",
        "Программы для создания цифровых двойников производственного оборудования и систем, инфраструктурных объектов и готовых изделий (DT)",
        "Программы производственного планирования (APS)",
        "Программы технического обслуживания и ремонта (CMMS)",
        "Программы управления жизненным циклом сервисного обслуживания",
        "Программы человеко-машинных интерфейсов на производстве (HMI)",
        "Средства автоматизированного проектирования (CAD)",
        "Средства автоматизированного проектирования для радиоэлектроники и электротехники (ECAD, EDA)",
        "Средства автоматизированного управления техникой",
        "Средства инженерного анализа (САЕ)",
        "Средства интегрированной логистической поддержки изделия (ILS)",
        "Средства информационного моделирования зданий и сооружений, архитектурно-строительного проектирования (BIM, AEC CAD)",
        "Средства технологической подготовки производства (САРР)",
        "Средства управления жизненным циклом изделия (PLM)",
        "Средства управления инженерными данными об изделии (PDM)",
        "Средства управления оборудованием с числовым программным управлением (САМ)",
        "Средства управления процессами и данными компьютерного моделирования (SPDM)",
        "Средства управления требованиями (RMS)",
        "Средства усовершенствованного управления технологическими процессами (APC, RTO)",
        "Универсальные машиностроительные средства автоматизированного проектирования (MCAD)",
        "Драйверы",
        "Мобильная операционная система",
        "Операционные системы общего назначения",
        "Операционные системы реального времени",
        "Программы обслуживания",
        "Серверное и связующее программное обеспечение",
        "Сетевая операционная система",
        "Системы контейнеризации и контейнеры",
        "Средства виртуализации",
        "Средства мониторинга и управления",
        "Средства обеспечения облачных и распределенных вычислений",
        "Средства управления базами данных",
        "Средства хранения данных",
        "Инструменты извлечения и трансформации данных (ETL)",
        "Инструменты обработки, анализа и распознавания изображений",
        "Предметно-ориентированные информационные базы данных (EDW)",
        "Программы виртуальной и дополненной реальности",
        "Средства аналитической обработки в реальном времени (OLAP)",
        "Средства интеллектуального анализа данных (Data Mining)",
        "Средства поддержки принятия решений (DSS)",
        "Межсетевые экраны",
        "Средства автоматизации процессов информационной безопасности",
        "Средства администрирования и управления жизненным циклом ключевых носителей",
        "Средства антивирусной защиты",
        "Средства выявления и предотвращения целевых атак",
        "Средства гарантированного уничтожения данных",
        "Средства защиты виртуальных сред",
        "Средства защиты каналов передачи данных, в том числе криптографическими методами",
        "Средства защиты от несанкционированного доступа к информации",
        "Средства защиты почтовых систем",
        "Средства защиты сервисов онлайн-платежей и дистанционного банковского обслуживания",
        "Средства защиты систем промышленной автоматизации (автоматизированных систем управления технологическими процессами)",
        "Средства криптографической защиты информации и электронной подписи",
        "Средства обнаружения и предотвращения утечек информации",
        "Средства обнаружения и/или предотвращения вторжений (атак)",
        "Средства обнаружения угроз и расследования сетевых инцидентов",
        "Средства резервного копирования",
        "Средства управления доступом к информационным ресурсам",
        "Средства управления событиями информационной безопасности",
        "Средства фильтрации негативного контента",
        "Средства математического и имитационного моделирования",
        "Средства обработки Больших Данных (BigData)",
        "Средства обработки и анализа геологических и геофизических данных",
        "Средства управления информационными ресурсами и средства управления основными данными (ECM, MDM)",
        "Библиотеки подпрограмм (SDK)",
        "Интегрированные платформы для создания приложений",
        "Мобильные платформы для разработки и управления мобильными приложениями",
        "Системы предотвращения анализа и восстановления исполняемого кода программ",
        "Средства анализа исходного кода на закладки и уязвимости",
        "Средства версионного контроля исходного кода",
        "Средства обратной инженерии кода программ",
        "Средства подготовки исполнимого кода",
        "Средства разработки программного обеспечения на основе квантовых технологий",
        "Средства разработки программного обеспечения на основе нейротехнологий и искусственного интеллекта",
        "Среды разработки, тестирования и отладки",
        "Программное обеспечение для функционирования системы юридически значимого электронного документооборота",
        "Программы автоматизированного контроля качества (CAQ)",
        "Программы управления заказами (ОМ)",
        "Системы роботизации процессов (RPA)",
        "Средства управления ИТ-службой, ИТ-инфраструктурой и ИТ-активами (ITSM-ServiceDesk, SCCM, Asset Management)",
        "Средства управления бизнес-процессами (ВРМ)",
        "Средства управления лабораторными потоками работ и документов (LIMS)",
        "Средства управления основными фондами предприятия (ЕАМ)",
        "Средства управления отношениями с клиентами (CRM)",
        "Средства управления производственными процессами (MES)",
        "Средства управления складом и цепочками поставок (WMS, SCM)",
        "Средства управления содержимым (CMS), сайты и портальные решения",
        "Средства управления технологическими процессами (АСУ ТП, SCADA)",
        "Средства управления эффективностью предприятия (СРМ/ЕРМ)",
        "Средства финансового менеджмента, управления активами и трудовыми ресурсами (ERP)",
        "Средства централизованного управления конечными устройствами",
        "Средства электронной коммерции (ecommerce platform)",
        "Встроенное микропрограммное обеспечение искусственного интеллекта",
        "Встроенные прикладные программы",
        "Встроенные системные программы-операционные системы",
        "Встроенные системные программы: BIOS, UEFI и иные встроенные системные программы",
        "Программное обеспечение интернета вещей, робототехники и сенсорики",
        "Геоинформационные и навигационные системы (GIS)",
        "Информационные системы для решения специфических отраслевых задач",
        "Лингвистическое программное обеспечение",
        "Офисные приложения",
        "Поисковые системы",
        "Прикладное программное обеспечение общего назначения",
        "Системы сбора, хранения, обработки, анализа, моделирования и визуализации массивов данных",
        "Системы управления проектами, исследованиями, разработкой, проектированием и внедрением",
        "Системы управления процессами организации",
        "Специализированное программное обеспечение органов исполнительной власти Российской Федерации, государственных корпораций, компаний и юридических лиц с преимущественным участием Российской Федерации для внутреннего использования",
        "Операционные системы",
        "Серверное и связующее программное обеспечение",
        "Системы мониторинга и управления",
        "Системы управления базами данных",
        "Средства обеспечения информационной безопасности",
        "Средства обеспечения облачных и распределенных вычислений, средства виртуализации и системы хранения данных",
        "Утилиты и Драйверы",
        "Библиотеки подпрограмм (SDK)",
        "Системы анализа исходного кода на закладки и уязвимости",
        "Средства версионного контроля исходного кода",
        "Средства подготовки исполнимого кода",
        "Среды разработки, тестирования и отладки",
        "BIOS и иное встроенное программное обеспечение",
        "Встроенное программное обеспечение телекоммуникационного оборудования"
    ];


    function populateDropdown() {
        const filter = searchInput.value.toUpperCase();
        dropdownList.innerHTML = '';
        const sortedItems = listItemsNameClassPO
            .map(region => {
                const matchIndex = region.toUpperCase().indexOf(filter);
                if (matchIndex !== -1) {
                    const beforeMatch = region.substring(0, matchIndex);
                    const matchText = region.substring(matchIndex, matchIndex + filter.length);
                    const afterMatch = region.substring(matchIndex + filter.length);
                    return {
                        region,
                        itemHtml: beforeMatch + '<span class="highlight">' + matchText + '</span>' + afterMatch,
                        matchIndex
                    };
                }
                return { region, matchIndex: -1 };
            })
            .filter(item => item.matchIndex !== -1)
            .sort((a, b) => a.matchIndex - b.matchIndex);

        sortedItems.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = item.itemHtml;
            li.setAttribute('data-value', item.region);
            li.addEventListener('click', () => {
                addTag(item.region);
                searchInput.value = '';
            });
            dropdownList.appendChild(li);
        });

        noResults.style.display = sortedItems.length ? 'none' : 'block';
    }

    function addTag(value) {
        if (value && !isTagSelected(value)) {
            const tag = document.createElement('div');
            tag.className = 'tag';
            tag.textContent = value;
            tag.addEventListener('click', () => {
                tag.remove();
                updateDropdown();
                updateSearchInput();
            });
            selectedTagsContainer.appendChild(tag);
            updateDropdown();
            updateSearchInput();
        }
    }

    function isTagSelected(value) {
        return Array.from(selectedTagsContainer.getElementsByClassName('tag'))
            .some(tag => tag.textContent === value);
    }

    function updateSearchInput() {
        const tags = Array.from(selectedTagsContainer.getElementsByClassName('tag'));
        searchInput.value = tags.map(tag => tag.textContent).join(' ');
    }

    function toggleDropdownVisibility(isVisible) {
        dropdown.style.display = isVisible ? 'block' : 'none';
        const icon = document.getElementById('dropdown-icon-1');
        if (isVisible) {
            icon.classList.add('rotate');
        } else {
            icon.classList.remove('rotate');
        }
    }

    searchInput.addEventListener('focus', () => {
        populateDropdown();
        toggleDropdownVisibility(true);
    });

    searchInput.addEventListener('input', () => {
        populateDropdown();
    });

    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const inputValue = searchInput.value.trim();
            if (inputValue) {
                selectFirstMatchingRegion(inputValue);
                searchInput.value = '';
            }
        }
    });

    document.addEventListener('click', (event) => {
        if (!searchInput.contains(event.target) && !dropdown.contains(event.target)) {
            toggleDropdownVisibility(false);
        }
    });

    populateDropdown();
    toggleDropdownVisibility(true);
}

//Обработчик ПАК название класса
function clickPAKNAME() {
    const searchInput = document.getElementById('search-input-4');
    const dropdownList = document.getElementById('dropdown-list-4');
    const selectedTagsContainer = document.getElementById('selected-tags-4');
    const dropdown = document.getElementById('dropdown-4');
    const noResults = document.getElementById('no-results-4');

    const listItemsNameClassPAK = [
        "Программно-аппаратные комплексы для проведения оперативно-розыскных мероприятий",
        "Программно-аппаратные комплексы систем накопления и хранения данных для проведения оперативно-розыскных мероприятий",
        "Программно-аппаратные комплексы в сфере строительства и жилищно-коммунального хозяйства",
        "Программно-аппаратные комплексы для проведения диагностики и лечения",
        "Программно-аппаратные комплексы для управления городским хозяйством",
        "Программно-аппаратные комплексы для автоматизации рабочего места кассира",
        "Программно-аппаратные комплексы для обеспечения товарного учёта",
        "Программно-аппаратные комплексы для осуществления приёма платежей",
        "Программно-аппаратные комплексы для осуществления расчётов индивидуальными предпринимателями или юридическими лицами с покупателями",
        "Программно-аппаратные комплексы для осуществления этикетирования при взвешивании",
        "Программно-аппаратные комплексы для штрихкодирования товаров, услуг или работ",
        "Программно-аппаратные комплексы информационного киоска",
        "Программно-аппаратные комплексы / система фото/видео фиксации нарушений правил дорожного движения",
        "Программно-аппаратные комплексы абонентские телематические терминалы",
        "Программно-аппаратные комплексы вызова экстренных оперативных служб",
        "Программно-аппаратные комплексы дорожного контроллера",
        "Программно-аппаратные комплексы дорожной инфраструктуры V2X (англ. - Road Side Unit, RSU)",
        "Программно-аппаратные комплексы платформы V2X (ядро сети V2X)",
        "Программно-аппаратные комплексы управления дорожным движением",
        "Программно-аппаратные комплексы для анализа финансового состояния и оценки кредитоспособности заёмщиков",
        "Программно-аппаратные комплексы переноса изображений и печати",
        "Программно-аппаратные комплексы распределенных систем цифровой печати",
        "Вычислительные программно-аппаратные комплексы виртуализации и управления ресурсами в среде облачных вычислений",
        "Вычислительные программно-аппаратные комплексы виртуализации рабочих мест и рабочих мест с доступом к виртуальным рабочим местам",
        "Вычислительные программно-аппаратные комплексы контейнерной виртуализации и пайплайна разработки",
        "3DOF программно-аппаратные комплексы виртуальной реальности",
        "6DOF программно-аппаратные комплексы виртуальной реальности",
        "Автономные программно-аппаратные комплексы виртуальной реальности",
        "Программно-аппаратные комплексы для автоматизации рабочего места кассира (Point of sale system, KCO, ТСО) с установленными JAVA-приложениями",
        "Программно-аппаратные комплексы для обеспечения товарного учёта с установленными JAVA-приложениями",
        "Программно-аппаратные комплексы для осуществления приёма платежей с установленными JAVA-приложениями",
        "Программно-аппаратные комплексы для осуществления расчётов индивидуальными предпринимателями или юридическими лицами с покупателями с установленными JAVA-приложениями",
        "Программно-аппаратные комплексы автоматизированных систем управления зданиями для «Умного многоквартирного дома»",
        "Программно-аппаратные комплексы для искусственного интеллекта",
        "Программно-аппаратные комплексы автоматизированного управления технологическим процессом",
        "Программно-аппаратные комплексы диспетчерского управления производством",
        "Программно-аппаратные комплексы контроля и диагностики оборудования",
        "Программно-аппаратные комплексы контроля технического состояния оборудования",
        "Программно-аппаратные комплексы планирования производством и поставкой",
        "Программно-аппаратные комплексы реального времени",
        "Программно-аппаратные комплексы регулирования режимов работы технологического оборудования",
        "Программно-аппаратные комплексы технического обслуживания активов",
        "Программно-аппаратные комплексы управления запасами",
        "Программно-аппаратные комплексы управления производством",
        "Модульные программно-аппаратные комплексы мониторинга и защиты от беспилотных летательных объектов",
        "Вычислительные программно-аппаратные комплексы управления многомодельными базами данных",
        "Вычислительные программно-аппаратные комплексы управления базами данных «ключ-значение»",
        "Вычислительные программно-аппаратные комплексы управления базами данных временных рядов",
        "Вычислительные программно-аппаратные комплексы управления базами данных колоночного хранения",
        "Вычислительные программно-аппаратные комплексы управления базами данных комбинированного типа",
        "Вычислительные программно-аппаратные комплексы управления базами данных реляционного типа",
        "Вычислительные программно-аппаратные комплексы управления графовыми базами данных",
        "Вычислительные программно-аппаратные комплексы управления документоориентированными базами данных",
        "Программно-аппаратные комплексы интеллектуального управления",
        "Программно-аппаратные комплексы мониторинга и управления",
        "Программно-аппаратные комплексы сбора, анализа и визуализации информации различных сред и процессов",
        "Программно-аппаратные комплексы управления визуализацией информации",
        "Программно-аппаратные комплексы управления информационными ресурсами и управления основными данными",
        "Программно-аппаратные комплексы, предоставляющие для решения задач, возникающих на различных этапах управления данными, в том числе преобразования, поиска и анализа информации с применением искусственного интеллекта",
        "Вычислительные программно-аппаратные комплексы для распределенной обработки данных",
        "Вычислительные программно-аппаратные комплексы для резидентной обработки данных в оперативной памяти",
        "Модульные программно-аппаратные комплексы базовых станций",
        "Модульные программно-аппаратные комплексы маршрутизации и коммутации",
        "Программно-аппаратные комплексы организации обучения и контроля навыков",
        "Геоинформационные и навигационные (GIS) Программно-аппаратный комплекс",
        "Модульные программно-аппаратные комплексы на основе гибкой архитектуры, оптимизированные под различные нагрузки и различный программный стек с возможностью эластичного использования ресурсов",
        "Программно-аппаратные комплексы аналитической обработки в реальном времени",
        "Программно-аппаратные комплексы извлечения и трансформации данных (ETL)",
        "Программно-аппаратные комплексы интеллектуального анализа данных (Data Mining)",
        "Программно-аппаратные комплексы математического и имитационного моделирования",
        "Программно-аппаратные комплексы обеспечения облачных и распределенных вычислений",
        "Программно-аппаратные комплексы обработки больших данных (BigData)",
        "Программно-аппаратные комплексы обработки и анализа геологических и геофизических данных",
        "Программно-аппаратные комплексы обработки, анализа и распознавания изображений",
        "Программно-аппаратные комплексы объектного хранилища",
        "Программно-аппаратные комплексы распределенного дискового массива",
        "Программно-аппаратные комплексы систем речевой аналитики и речевого оповещения",
        "Программно-аппаратные комплексы системы хранения данных",
        "Программно-аппаратные комплексы, созданные на машинах вычислительных электронных цифровых (клиентские системы)",
        "Программно-аппаратные комплексы, созданные на серверах или устройствах, содержащие в своем составе один или более вычислительных узлов",
        "Программно-аппаратные комплексы экологического мониторинга внешней среды",
        "Программно-аппаратные комплексы атмосферного мониторинга",
        "Программно-аппаратные комплексы высокотехнологичных отраслей",
        "Программно-аппаратные комплексы гидромониторинга окружающей среды",
        "Программно-аппаратные комплексы для автоматизированного и роботизированного контроля в промышленном производстве",
        "Программно-аппаратные комплексы для мониторинга технического состояния энергетического оборудования",
        "Программно-аппаратные комплексы для мониторинга утечек",
        "Программно-аппаратные комплексы измерения параметров технологических процессов в промышленном производстве",
        "Программно-аппаратные комплексы измерения, учёта и анализа потребления ресурсов промышленными объектами",
        "Программно-аппаратные комплексы мониторинга геологических процессов",
        "Программно-аппаратные комплексы мониторинга геотехнических сооружений",
        "Программно-аппаратные комплексы мониторинга дорожных ситуаций и оценки дорожного полотна",
        "Программно-аппаратные комплексы радиоизмерительных приборов общего назначения для промышленности и метрологии",
        "Программно-аппаратные комплексы администрирования и управления жизненным циклом ключевых носителей",
        "Программно-аппаратные комплексы антивирусной защиты",
        "Программно-аппаратные комплексы выявления целевых компьютерных атак",
        "Программно-аппаратные комплексы гарантированного уничтожения данных",
        "Программно-аппаратные комплексы для безопасного прямого сбора данных с промышленного контура предприятия с последующей предобработкой, конвертацией и передаче их в информационные системы",
        "Программно-аппаратные комплексы для безопасного хранения и переноса информации",
        "Программно-аппаратные комплексы для защиты программного обеспечения от нелегального копирования и использования",
        "Программно-аппаратные комплексы для обеспечения безопасной дистанционной работы",
        "Программно-аппаратные комплексы для обеспечения безопасной разработки программного обеспечения",
        "Программно-аппаратные комплексы для обнаружения угроз и расследования сетевых инцидентов",
        "Программно-аппаратные комплексы для однонаправленной передачи информации",
        "Программно-аппаратные комплексы для работы в выделенных помещениях и для обработки сведений содержащих государственную тайну",
        "Программно-аппаратные комплексы защиты информации и электронной подписи",
        "Программно-аппаратные комплексы защиты каналов передачи данных, в том числе криптографическими методами",
        "Программно-аппаратные комплексы защиты от мошенничества",
        "Программно-аппаратные комплексы защиты от несанкционированного доступа к информации",
        "Программно-аппаратные комплексы квантовых криптографических систем выработки и распределения ключа",
        "Программно-аппаратные комплексы ключевых носителей",
        "Программно-аппаратные комплексы межсетевых экранов",
        "Программно-аппаратные комплексы обнаружения и предотвращения утечек информации",
        "Программно-аппаратные комплексы обнаружения и/или предотвращения вторжений (атак)",
        "Программно-аппаратные комплексы организации информационного периметра",
        "Программно-аппаратные комплексы резервного копирования",
        "Программно-аппаратные комплексы средства автоматизации процессов информационной безопасности",
        "Программно-аппаратные комплексы управления доступом к информационным ресурсам",
        "Программно-аппаратные комплексы управления событиями информационной безопасности",
        "Программно-аппаратные комплексы фильтрации негативного контента",
        "Программно-аппаратные комплексы эмуляции устройств"
    ];

    function populateDropdown() {
        const filter = searchInput.value.toUpperCase();
        dropdownList.innerHTML = '';
        const sortedItems = listItemsNameClassPAK
            .map(region => {
                const matchIndex = region.toUpperCase().indexOf(filter);
                if (matchIndex !== -1) {
                    const beforeMatch = region.substring(0, matchIndex);
                    const matchText = region.substring(matchIndex, matchIndex + filter.length);
                    const afterMatch = region.substring(matchIndex + filter.length);
                    return {
                        region,
                        itemHtml: beforeMatch + '<span class="highlight">' + matchText + '</span>' + afterMatch,
                        matchIndex
                    };
                }
                return { region, matchIndex: -1 };
            })
            .filter(item => item.matchIndex !== -1)
            .sort((a, b) => a.matchIndex - b.matchIndex);

        sortedItems.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = item.itemHtml;
            li.setAttribute('data-value', item.region);
            li.addEventListener('click', () => {
                addTag(item.region);
                searchInput.value = '';
            });
            dropdownList.appendChild(li);
        });

        noResults.style.display = sortedItems.length ? 'none' : 'block';
    }

    function addTag(value) {
        if (value && !isTagSelected(value)) {
            const tag = document.createElement('div');
            tag.className = 'tag';
            tag.textContent = value;
            tag.addEventListener('click', () => {
                tag.remove();
                updateDropdown();
                updateSearchInput();
            });
            selectedTagsContainer.appendChild(tag);
            updateDropdown();
            updateSearchInput();
        }
    }

    function isTagSelected(value) {
        return Array.from(selectedTagsContainer.getElementsByClassName('tag'))
            .some(tag => tag.textContent === value);
    }

    function updateSearchInput() {
        const tags = Array.from(selectedTagsContainer.getElementsByClassName('tag'));
        searchInput.value = tags.map(tag => tag.textContent).join(' ');
    }

    function toggleDropdownVisibility(isVisible) {
        dropdown.style.display = isVisible ? 'block' : 'none';
        const icon = document.getElementById('dropdown-icon-4');
        if (isVisible) {
            icon.classList.add('rotate');
        } else {
            icon.classList.remove('rotate');
        }
    }

    searchInput.addEventListener('focus', () => {
        populateDropdown();
        toggleDropdownVisibility(true);
    });

    searchInput.addEventListener('input', () => {
        populateDropdown();
    });

    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const inputValue = searchInput.value.trim();
            if (inputValue) {
                selectFirstMatchingRegion(inputValue);
                searchInput.value = '';
            }
        }
    });

    document.addEventListener('click', (event) => {
        if (!searchInput.contains(event.target) && !dropdown.contains(event.target)) {
            toggleDropdownVisibility(false);
        }
    });

    populateDropdown();
    toggleDropdownVisibility(true);
}
function clickPAKNAME2() {
    const searchInput = document.getElementById('search-input-3');
    const dropdownList = document.getElementById('dropdown-list-3');
    const selectedTagsContainer = document.getElementById('selected-tags-3');
    const dropdown = document.getElementById('dropdown-3');
    const noResults = document.getElementById('no-results-3');

    const listItemsNameClassPAK = [
        "Программно-аппаратные комплексы для проведения оперативно-розыскных мероприятий",
        "Программно-аппаратные комплексы систем накопления и хранения данных для проведения оперативно-розыскных мероприятий",
        "Программно-аппаратные комплексы в сфере строительства и жилищно-коммунального хозяйства",
        "Программно-аппаратные комплексы для проведения диагностики и лечения",
        "Программно-аппаратные комплексы для управления городским хозяйством",
        "Программно-аппаратные комплексы для автоматизации рабочего места кассира",
        "Программно-аппаратные комплексы для обеспечения товарного учёта",
        "Программно-аппаратные комплексы для осуществления приёма платежей",
        "Программно-аппаратные комплексы для осуществления расчётов индивидуальными предпринимателями или юридическими лицами с покупателями",
        "Программно-аппаратные комплексы для осуществления этикетирования при взвешивании",
        "Программно-аппаратные комплексы для штрихкодирования товаров, услуг или работ",
        "Программно-аппаратные комплексы информационного киоска",
        "Программно-аппаратные комплексы / система фото/видео фиксации нарушений правил дорожного движения",
        "Программно-аппаратные комплексы абонентские телематические терминалы",
        "Программно-аппаратные комплексы вызова экстренных оперативных служб",
        "Программно-аппаратные комплексы дорожного контроллера",
        "Программно-аппаратные комплексы дорожной инфраструктуры V2X (англ. - Road Side Unit, RSU)",
        "Программно-аппаратные комплексы платформы V2X (ядро сети V2X)",
        "Программно-аппаратные комплексы управления дорожным движением",
        "Программно-аппаратные комплексы для анализа финансового состояния и оценки кредитоспособности заёмщиков",
        "Программно-аппаратные комплексы переноса изображений и печати",
        "Программно-аппаратные комплексы распределенных систем цифровой печати",
        "Вычислительные программно-аппаратные комплексы виртуализации и управления ресурсами в среде облачных вычислений",
        "Вычислительные программно-аппаратные комплексы виртуализации рабочих мест и рабочих мест с доступом к виртуальным рабочим местам",
        "Вычислительные программно-аппаратные комплексы контейнерной виртуализации и пайплайна разработки",
        "3DOF программно-аппаратные комплексы виртуальной реальности",
        "6DOF программно-аппаратные комплексы виртуальной реальности",
        "Автономные программно-аппаратные комплексы виртуальной реальности",
        "Программно-аппаратные комплексы для автоматизации рабочего места кассира (Point of sale system, KCO, ТСО) с установленными JAVA-приложениями",
        "Программно-аппаратные комплексы для обеспечения товарного учёта с установленными JAVA-приложениями",
        "Программно-аппаратные комплексы для осуществления приёма платежей с установленными JAVA-приложениями",
        "Программно-аппаратные комплексы для осуществления расчётов индивидуальными предпринимателями или юридическими лицами с покупателями с установленными JAVA-приложениями",
        "Программно-аппаратные комплексы автоматизированных систем управления зданиями для «Умного многоквартирного дома»",
        "Программно-аппаратные комплексы для искусственного интеллекта",
        "Программно-аппаратные комплексы автоматизированного управления технологическим процессом",
        "Программно-аппаратные комплексы диспетчерского управления производством",
        "Программно-аппаратные комплексы контроля и диагностики оборудования",
        "Программно-аппаратные комплексы контроля технического состояния оборудования",
        "Программно-аппаратные комплексы планирования производством и поставкой",
        "Программно-аппаратные комплексы реального времени",
        "Программно-аппаратные комплексы регулирования режимов работы технологического оборудования",
        "Программно-аппаратные комплексы технического обслуживания активов",
        "Программно-аппаратные комплексы управления запасами",
        "Программно-аппаратные комплексы управления производством",
        "Модульные программно-аппаратные комплексы мониторинга и защиты от беспилотных летательных объектов",
        "Вычислительные программно-аппаратные комплексы управления многомодельными базами данных",
        "Вычислительные программно-аппаратные комплексы управления базами данных «ключ-значение»",
        "Вычислительные программно-аппаратные комплексы управления базами данных временных рядов",
        "Вычислительные программно-аппаратные комплексы управления базами данных колоночного хранения",
        "Вычислительные программно-аппаратные комплексы управления базами данных комбинированного типа",
        "Вычислительные программно-аппаратные комплексы управления базами данных реляционного типа",
        "Вычислительные программно-аппаратные комплексы управления графовыми базами данных",
        "Вычислительные программно-аппаратные комплексы управления документоориентированными базами данных",
        "Программно-аппаратные комплексы интеллектуального управления",
        "Программно-аппаратные комплексы мониторинга и управления",
        "Программно-аппаратные комплексы сбора, анализа и визуализации информации различных сред и процессов",
        "Программно-аппаратные комплексы управления визуализацией информации",
        "Программно-аппаратные комплексы управления информационными ресурсами и управления основными данными",
        "Программно-аппаратные комплексы, предоставляющие для решения задач, возникающих на различных этапах управления данными, в том числе преобразования, поиска и анализа информации с применением искусственного интеллекта",
        "Вычислительные программно-аппаратные комплексы для распределенной обработки данных",
        "Вычислительные программно-аппаратные комплексы для резидентной обработки данных в оперативной памяти",
        "Модульные программно-аппаратные комплексы базовых станций",
        "Модульные программно-аппаратные комплексы маршрутизации и коммутации",
        "Программно-аппаратные комплексы организации обучения и контроля навыков",
        "Геоинформационные и навигационные (GIS) Программно-аппаратный комплекс",
        "Модульные программно-аппаратные комплексы на основе гибкой архитектуры, оптимизированные под различные нагрузки и различный программный стек с возможностью эластичного использования ресурсов",
        "Программно-аппаратные комплексы аналитической обработки в реальном времени",
        "Программно-аппаратные комплексы извлечения и трансформации данных (ETL)",
        "Программно-аппаратные комплексы интеллектуального анализа данных (Data Mining)",
        "Программно-аппаратные комплексы математического и имитационного моделирования",
        "Программно-аппаратные комплексы обеспечения облачных и распределенных вычислений",
        "Программно-аппаратные комплексы обработки больших данных (BigData)",
        "Программно-аппаратные комплексы обработки и анализа геологических и геофизических данных",
        "Программно-аппаратные комплексы обработки, анализа и распознавания изображений",
        "Программно-аппаратные комплексы объектного хранилища",
        "Программно-аппаратные комплексы распределенного дискового массива",
        "Программно-аппаратные комплексы систем речевой аналитики и речевого оповещения",
        "Программно-аппаратные комплексы системы хранения данных",
        "Программно-аппаратные комплексы, созданные на машинах вычислительных электронных цифровых (клиентские системы)",
        "Программно-аппаратные комплексы, созданные на серверах или устройствах, содержащие в своем составе один или более вычислительных узлов",
        "Программно-аппаратные комплексы экологического мониторинга внешней среды",
        "Программно-аппаратные комплексы атмосферного мониторинга",
        "Программно-аппаратные комплексы высокотехнологичных отраслей",
        "Программно-аппаратные комплексы гидромониторинга окружающей среды",
        "Программно-аппаратные комплексы для автоматизированного и роботизированного контроля в промышленном производстве",
        "Программно-аппаратные комплексы для мониторинга технического состояния энергетического оборудования",
        "Программно-аппаратные комплексы для мониторинга утечек",
        "Программно-аппаратные комплексы измерения параметров технологических процессов в промышленном производстве",
        "Программно-аппаратные комплексы измерения, учёта и анализа потребления ресурсов промышленными объектами",
        "Программно-аппаратные комплексы мониторинга геологических процессов",
        "Программно-аппаратные комплексы мониторинга геотехнических сооружений",
        "Программно-аппаратные комплексы мониторинга дорожных ситуаций и оценки дорожного полотна",
        "Программно-аппаратные комплексы радиоизмерительных приборов общего назначения для промышленности и метрологии",
        "Программно-аппаратные комплексы администрирования и управления жизненным циклом ключевых носителей",
        "Программно-аппаратные комплексы антивирусной защиты",
        "Программно-аппаратные комплексы выявления целевых компьютерных атак",
        "Программно-аппаратные комплексы гарантированного уничтожения данных",
        "Программно-аппаратные комплексы для безопасного прямого сбора данных с промышленного контура предприятия с последующей предобработкой, конвертацией и передаче их в информационные системы",
        "Программно-аппаратные комплексы для безопасного хранения и переноса информации",
        "Программно-аппаратные комплексы для защиты программного обеспечения от нелегального копирования и использования",
        "Программно-аппаратные комплексы для обеспечения безопасной дистанционной работы",
        "Программно-аппаратные комплексы для обеспечения безопасной разработки программного обеспечения",
        "Программно-аппаратные комплексы для обнаружения угроз и расследования сетевых инцидентов",
        "Программно-аппаратные комплексы для однонаправленной передачи информации",
        "Программно-аппаратные комплексы для работы в выделенных помещениях и для обработки сведений содержащих государственную тайну",
        "Программно-аппаратные комплексы защиты информации и электронной подписи",
        "Программно-аппаратные комплексы защиты каналов передачи данных, в том числе криптографическими методами",
        "Программно-аппаратные комплексы защиты от мошенничества",
        "Программно-аппаратные комплексы защиты от несанкционированного доступа к информации",
        "Программно-аппаратные комплексы квантовых криптографических систем выработки и распределения ключа",
        "Программно-аппаратные комплексы ключевых носителей",
        "Программно-аппаратные комплексы межсетевых экранов",
        "Программно-аппаратные комплексы обнаружения и предотвращения утечек информации",
        "Программно-аппаратные комплексы обнаружения и/или предотвращения вторжений (атак)",
        "Программно-аппаратные комплексы организации информационного периметра",
        "Программно-аппаратные комплексы резервного копирования",
        "Программно-аппаратные комплексы средства автоматизации процессов информационной безопасности",
        "Программно-аппаратные комплексы управления доступом к информационным ресурсам",
        "Программно-аппаратные комплексы управления событиями информационной безопасности",
        "Программно-аппаратные комплексы фильтрации негативного контента",
        "Программно-аппаратные комплексы эмуляции устройств"
    ];

    function populateDropdown() {
        const filter = searchInput.value.toUpperCase();
        dropdownList.innerHTML = '';
        const sortedItems = listItemsNameClassPAK
            .map(region => {
                const matchIndex = region.toUpperCase().indexOf(filter);
                if (matchIndex !== -1) {
                    const beforeMatch = region.substring(0, matchIndex);
                    const matchText = region.substring(matchIndex, matchIndex + filter.length);
                    const afterMatch = region.substring(matchIndex + filter.length);
                    return {
                        region,
                        itemHtml: beforeMatch + '<span class="highlight">' + matchText + '</span>' + afterMatch,
                        matchIndex
                    };
                }
                return { region, matchIndex: -1 };
            })
            .filter(item => item.matchIndex !== -1)
            .sort((a, b) => a.matchIndex - b.matchIndex);

        sortedItems.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = item.itemHtml;
            li.setAttribute('data-value', item.region);
            li.addEventListener('click', () => {
                addTag(item.region);
                searchInput.value = '';
            });
            dropdownList.appendChild(li);
        });

        noResults.style.display = sortedItems.length ? 'none' : 'block';
    }

    function addTag(value) {
        if (value && !isTagSelected(value)) {
            const tag = document.createElement('div');
            tag.className = 'tag';
            tag.textContent = value;
            tag.addEventListener('click', () => {
                tag.remove();
                updateDropdown();
                updateSearchInput();
            });
            selectedTagsContainer.appendChild(tag);
            updateDropdown();
            updateSearchInput();
        }
    }

    function isTagSelected(value) {
        return Array.from(selectedTagsContainer.getElementsByClassName('tag'))
            .some(tag => tag.textContent === value);
    }

    function updateSearchInput() {
        const tags = Array.from(selectedTagsContainer.getElementsByClassName('tag'));
        searchInput.value = tags.map(tag => tag.textContent).join(' ');
    }

    function toggleDropdownVisibility(isVisible) {
        dropdown.style.display = isVisible ? 'block' : 'none';
        const icon = document.getElementById('dropdown-icon-4');
        if (isVisible) {
            icon.classList.add('rotate');
        } else {
            icon.classList.remove('rotate');
        }
    }

    searchInput.addEventListener('focus', () => {
        populateDropdown();
        toggleDropdownVisibility(true);
    });

    searchInput.addEventListener('input', () => {
        populateDropdown();
    });

    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const inputValue = searchInput.value.trim();
            if (inputValue) {
                selectFirstMatchingRegion(inputValue);
                searchInput.value = '';
            }
        }
    });

    document.addEventListener('click', (event) => {
        if (!searchInput.contains(event.target) && !dropdown.contains(event.target)) {
            toggleDropdownVisibility(false);
        }
    });

    populateDropdown();
    toggleDropdownVisibility(true);
}

//Обработчик отрасль
function clickPAKOTRASL() {
    const searchInput = document.getElementById('search-input-5');
    const dropdownList = document.getElementById('dropdown-list-5');
    const selectedTagsContainer = document.getElementById('selected-tags-5');
    const dropdown = document.getElementById('dropdown-5');
    const noResults = document.getElementById('no-results-5');

    const listItemsTypeExperience = [
        "Аренда",
        "Архитектура",
        "Банки и финансы",
        "Бюджетные учреждения",
        "Ветеринарная медицина",
        "Геодезия и картография",
        "Геофизическое моделирование и обработка исследований",
        "Госуслуги",
        "Добывающая промышленность",
        "IT",
        "Инструмент для разработчика",
        "Колл-центры",
        "Машиностроение",
        "Медицина",
        "Музеи",
        "Наука",
        "Образование",
        "Общественное питание",
        "Органы власти",
        "Пищевая промышленность",
        "Приборостроение",
        "Проектирование/Конструирование",
        "Производство",
        "Реклама",
        "Сельское хозяйство",
        "Склады, логистика",
        "Страхование",
        "Строительство",
        "Телевидение, радиовещание",
        "Телекоммуникации",
        "Торговля",
        "Транспорт",
        "Турбизнес",
        "Умный город",
        "Умный дом",
        "Универсальное решение",
        "Управление ЖКХ",
        "Управление медицинской организацией",
        "Управление финансами",
        "Фармакология и фармацевтика",
        "Энергетика"
    ];


    function populateDropdown() {
        const filter = searchInput.value.toUpperCase();
        dropdownList.innerHTML = '';
        const sortedItems = listItemsTypeExperience
            .map(region => {
                const matchIndex = region.toUpperCase().indexOf(filter);
                if (matchIndex !== -1) {
                    const beforeMatch = region.substring(0, matchIndex);
                    const matchText = region.substring(matchIndex, matchIndex + filter.length);
                    const afterMatch = region.substring(matchIndex + filter.length);
                    return {
                        region,
                        itemHtml: beforeMatch + '<span class="highlight">' + matchText + '</span>' + afterMatch,
                        matchIndex
                    };
                }
                return { region, matchIndex: -1 };
            })
            .filter(item => item.matchIndex !== -1)
            .sort((a, b) => a.matchIndex - b.matchIndex);

        sortedItems.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = item.itemHtml;
            li.setAttribute('data-value', item.region);
            li.addEventListener('click', () => {
                addTag(item.region);
                searchInput.value = '';
            });
            dropdownList.appendChild(li);
        });

        noResults.style.display = sortedItems.length ? 'none' : 'block';
    }

    function addTag(value) {
        if (value && !isTagSelected(value)) {
            const tag = document.createElement('div');
            tag.className = 'tag';
            tag.textContent = value;
            tag.addEventListener('click', () => {
                tag.remove();
                updateDropdown();
                updateSearchInput();
            });
            selectedTagsContainer.appendChild(tag);
            updateDropdown();
            updateSearchInput();
        }
    }

    function isTagSelected(value) {
        return Array.from(selectedTagsContainer.getElementsByClassName('tag'))
            .some(tag => tag.textContent === value);
    }

    function updateSearchInput() {
        const tags = Array.from(selectedTagsContainer.getElementsByClassName('tag'));
        searchInput.value = tags.map(tag => tag.textContent).join(' ');
    }

    function toggleDropdownVisibility(isVisible) {
        dropdown.style.display = isVisible ? 'block' : 'none';
        const icon = document.getElementById('dropdown-icon-5');
        if (isVisible) {
            icon.classList.add('rotate');
        } else {
            icon.classList.remove('rotate');
        }
    }

    searchInput.addEventListener('focus', () => {
        populateDropdown();
        toggleDropdownVisibility(true);
    });

    searchInput.addEventListener('input', () => {
        populateDropdown();
    });

    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const inputValue = searchInput.value.trim();
            if (inputValue) {
                selectFirstMatchingRegion(inputValue);
                searchInput.value = '';
            }
        }
    });

    document.addEventListener('click', (event) => {
        if (!searchInput.contains(event.target) && !dropdown.contains(event.target)) {
            toggleDropdownVisibility(false);
        }
    });

    populateDropdown();
    toggleDropdownVisibility(true);
}
function clickPAKOTRASL2() {
    const searchInput = document.getElementById('search-input-6');
    const dropdownList = document.getElementById('dropdown-list-6');
    const selectedTagsContainer = document.getElementById('selected-tags-6');
    const dropdown = document.getElementById('dropdown-6');
    const noResults = document.getElementById('no-results-6');

    const listItemsTypeExperience = [
        "Аренда",
        "Архитектура",
        "Банки и финансы",
        "Бюджетные учреждения",
        "Ветеринарная медицина",
        "Геодезия и картография",
        "Геофизическое моделирование и обработка исследований",
        "Госуслуги",
        "Добывающая промышленность",
        "IT",
        "Инструмент для разработчика",
        "Колл-центры",
        "Машиностроение",
        "Медицина",
        "Музеи",
        "Наука",
        "Образование",
        "Общественное питание",
        "Органы власти",
        "Пищевая промышленность",
        "Приборостроение",
        "Проектирование/Конструирование",
        "Производство",
        "Реклама",
        "Сельское хозяйство",
        "Склады, логистика",
        "Страхование",
        "Строительство",
        "Телевидение, радиовещание",
        "Телекоммуникации",
        "Торговля",
        "Транспорт",
        "Турбизнес",
        "Умный город",
        "Умный дом",
        "Универсальное решение",
        "Управление ЖКХ",
        "Управление медицинской организацией",
        "Управление финансами",
        "Фармакология и фармацевтика",
        "Энергетика"
    ];


    function populateDropdown() {
        const filter = searchInput.value.toUpperCase();
        dropdownList.innerHTML = '';
        const sortedItems = listItemsTypeExperience
            .map(region => {
                const matchIndex = region.toUpperCase().indexOf(filter);
                if (matchIndex !== -1) {
                    const beforeMatch = region.substring(0, matchIndex);
                    const matchText = region.substring(matchIndex, matchIndex + filter.length);
                    const afterMatch = region.substring(matchIndex + filter.length);
                    return {
                        region,
                        itemHtml: beforeMatch + '<span class="highlight">' + matchText + '</span>' + afterMatch,
                        matchIndex
                    };
                }
                return { region, matchIndex: -1 };
            })
            .filter(item => item.matchIndex !== -1)
            .sort((a, b) => a.matchIndex - b.matchIndex);

        sortedItems.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = item.itemHtml;
            li.setAttribute('data-value', item.region);
            li.addEventListener('click', () => {
                addTag(item.region);
                searchInput.value = '';
            });
            dropdownList.appendChild(li);
        });

        noResults.style.display = sortedItems.length ? 'none' : 'block';
    }

    function addTag(value) {
        if (value && !isTagSelected(value)) {
            const tag = document.createElement('div');
            tag.className = 'tag';
            tag.textContent = value;
            tag.addEventListener('click', () => {
                tag.remove();
                updateDropdown();
                updateSearchInput();
            });
            selectedTagsContainer.appendChild(tag);
            updateDropdown();
            updateSearchInput();
        }
    }

    function isTagSelected(value) {
        return Array.from(selectedTagsContainer.getElementsByClassName('tag'))
            .some(tag => tag.textContent === value);
    }

    function updateSearchInput() {
        const tags = Array.from(selectedTagsContainer.getElementsByClassName('tag'));
        searchInput.value = tags.map(tag => tag.textContent).join(' ');
    }

    function toggleDropdownVisibility(isVisible) {
        dropdown.style.display = isVisible ? 'block' : 'none';
        const icon = document.getElementById('dropdown-icon-5');
        if (isVisible) {
            icon.classList.add('rotate');
        } else {
            icon.classList.remove('rotate');
        }
    }

    searchInput.addEventListener('focus', () => {
        populateDropdown();
        toggleDropdownVisibility(true);
    });

    searchInput.addEventListener('input', () => {
        populateDropdown();
    });

    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const inputValue = searchInput.value.trim();
            if (inputValue) {
                selectFirstMatchingRegion(inputValue);
                searchInput.value = '';
            }
        }
    });

    document.addEventListener('click', (event) => {
        if (!searchInput.contains(event.target) && !dropdown.contains(event.target)) {
            toggleDropdownVisibility(false);
        }
    });

    populateDropdown();
    toggleDropdownVisibility(true);
}
