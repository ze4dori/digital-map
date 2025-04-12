let data;
let selectedRegions = [];
let slideIndex = 1;  // или 0, в зависимости от вашего желания
let regionName;


function updateDisplayedContacts() {
    const regionsContainer = document.getElementById('regions-container');
    regionsContainer.innerHTML = '';

    if (selectedRegions.includes("Вся Россия")) {
        data.contacts.forEach(contact => {
            addContactToContainer(contact);
        });
    } else if (selectedRegions.length === 0) {
        data.contacts.forEach(contact => {
            addContactToContainer(contact);
        });
    } else {
        const filteredContacts = data.contacts.filter(contact => selectedRegions.includes(contact.region));
        filteredContacts.forEach(contact => {
            addContactToContainer(contact);
        });
    }
}

function addContactToContainer(contact) {
    const regionsContainer = document.getElementById('regions-container');
    const regContainer = document.createElement('div');
    regContainer.classList.add('reg-container');

    regContainer.innerHTML = `
        <img src="../static/images/emblems/${contact.id}.png" style="width: 2.6vw; height: 2.6vw; margin-left: 1.56vw;">
        <h2>${contact.region}</h2>
        <div style="margin-right: 1.56vw;">
            <h3>Контакты</h3>
            <div style="display: flex;">
                <p>${contact.email}</p>
                <p style="margin-left: 1.875vw;">${contact.phone}</p>
            </div>
        </div>
    `;

    regionsContainer.appendChild(regContainer);
}

function loadRegionContacts() {
    fetch('/region-contacts/info')
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка сети или неправильный ответ');
            }
            return response.json();
        })
        .then(responseData => {
            data = responseData; // Сохраняем данные в переменной
            console.log(data); // Добавляем лог для проверки данных
            updateDisplayedContacts(); // Показываем все контакты при загрузке
        })
        .catch(error => {
            console.error('Ошибка при загрузке данных:', error);
        });
}

function handleMouseEnter(event) {
    const region = event.target;
    const popup = document.getElementById("InfoInPopUp");

    if (region.classList.contains('selected')) {
        const params = new URLSearchParams({
            button: activeButtonId
        });
    
        const id = region.id;
    
        fetch(`/region/${region.id}?${params}`)
            .then(response => response.ok ? response.json() : Promise.reject('Сетевая ошибка'))
            .then(region => {
                updatePopup(region.name, region.count, id);
            })
            .catch(error => {
                console.error('Ошибка:', error);
                document.getElementById("dynamicRegion").innerHTML = "Ошибка получения данных";
            });

        popup.style.display = "block";
    } else {
        // Код для работы с попапом при отсутствии класса 'selected' аналогично
        const params = new URLSearchParams({
            button: activeButtonId
        });
    
        const id = region.id;
    
        fetch(`/region/${region.id}?${params}`)
            .then(response => response.ok ? response.json() : Promise.reject('Сетевая ошибка'))
            .then(region => {
                updatePopup(region.name, region.count, id);
            })
            .catch(error => {
                console.error('Ошибка:', error);
                document.getElementById("dynamicRegion").innerHTML = "Ошибка получения данных";
            });

        popup.style.display = "block";
    }

    // Позиционируем попап относительно позиции курсора
    const offsetX = 10;
    const offsetY = 10;
    popup.style.left = `${event.pageX + offsetX}px`;
    popup.style.top = `${event.pageY + offsetY}px`;

    // Если регион не выбран, меняем его цвет
    if (!region.classList.contains('selected')) {
        region.setAttribute('fill', 'rgba(80, 79, 217, 1)');
    }
}

function handleMouseMove(event) {
    const popup = document.getElementById("InfoInPopUp");

    // Обновляем позицию попапа при движении мыши
    const offsetX = 10;
    const offsetY = 10;
    popup.style.left = `${event.pageX + offsetX}px`;
    popup.style.top = `${event.pageY + offsetY}px`;
}

function handleMouseLeave(event) {
    const region = event.target;
    const popup = document.getElementById("InfoInPopUp");
    const selectedRegion = document.querySelector('.svg-map path.selected');

    if (!selectedRegion || !selectedRegion.contains(event.relatedTarget)) {
        popup.style.display = "none";
    }

    if (!region.classList.contains('selected')) {
        region.setAttribute('fill', '#7D9FE8');
    }
}

function handleMouseLeave(event) {
    const region = event.target;

    const popup = document.getElementById("InfoInPopUp");
    const selectedRegion = document.querySelector('.svg-map path.selected');

    if (!selectedRegion || !selectedRegion.contains(event.relatedTarget)) {
        popup.style.display = "none";
    }

    if (!region.classList.contains('selected')) {
        region.setAttribute('fill', '#7D9FE8');
    }
}

function handleClick(event) {
    const region = event.target;
    const regions = document.querySelectorAll('.svg-map path');
    const svgElement = document.getElementById("mySvg");
    const myList = document.getElementById('myList');
    const myITinfo = document.getElementById('myITinfo')

    const backButton = document.getElementById('ButtonBack');
    backButton.style.display = 'none';

    if (region.classList.contains('selected')) {
        region.setAttribute('fill', '#7D9FE8');
        region.classList.remove('selected');
        myList.style.display = 'none';
        myITinfo.style.display = 'none';
        backButton.style.display = 'block';

        var scale = 1;
        svgElement.style.transform = "scale(" + scale + ") translateX(0%)";
        svgElement.style.transition = "transform 1.5s";

        document.getElementById("InfoInPopUp").style.display = "none";

    } else {
        window.idBlock = undefined;
        myITinfo.style.display = 'none';
        regions.forEach(r => {
            r.setAttribute('fill', '#7D9FE8');
            r.classList.remove('selected');
        });

        region.setAttribute('fill', 'rgba(80, 79, 217, 1)');
        region.classList.add('selected');

        const myList = document.getElementById('myList');
        myList.style.display = 'block';
        

        var scale = 0.8;
        svgElement.style.transform = "scale(" + scale + ") translateX(-20%)";
        svgElement.style.transition = "transform 1.5s";
    }

    const params = new URLSearchParams({
        button: activeButtonId
    })

    const id = region.id;

    fetch(`/region/${region.id}?${params}`)
    .then(response => response.ok ? response.json() : Promise.reject('Сетевая ошибка'))
    .then(region => {
        regionName = region.name;
        updatePopup(region.name, region.count, id);

        const request = new XMLHttpRequest();
        request.open('POST', '/filterRegion');
        request.setRequestHeader('Content-Type', 'application/json');

        request.onload = function () {
            if (request.status >= 200 && request.status < 300) {
                try {
                    const response = JSON.parse(request.responseText);
                    console.log(response);

                    const listContainer = document.querySelector('.list-items');
                    listContainer.innerHTML = '';

                    if (response.companies.length === 0) {
                        listContainer.innerHTML = '<p style="margin-left: 1.04vw;">По вашему запросу ничего не найдено.</p>';
                    } else {
                        response.companies.forEach(item => {
                            const listItem = document.createElement('div');
                            listItem.classList.add('list-item');

                            const logoSrc = item.logo_company.startsWith("https://disk.yandex.ru/i/") 
                                ? `https://getfile.dokpub.com/yandex/get/${item.logo_company}` 
                                : item.logo_company;

                            listItem.innerHTML = `
                                <div class="container" id="${item.id}" onclick="myFunctionInfo(${item.id})">
                                    <div class="info_container">
                                        <img src="${logoSrc}" alt="Иконка">
                                        <h2>${item.company_name}</h2>
                                    </div>
                                    <p>${item.position_company}</p>
                                    <p>${item.address}</p>
                                </div>
                            `;
                            listContainer.appendChild(listItem);
                        });
                    }
                } catch (e) {
                    console.error('Ошибка при разборе ответа:', e);
                }
            } else {
                alert('Ошибка при отправке запроса!');
            }
        };

        request.onerror = function () {
            alert('Ошибка соединения с сервером!');
        };

        request.send(JSON.stringify({ activeButtonId, regionName }));
    })
    .catch(error => {
        console.error('Ошибка:', error);
        document.getElementById("dynamicRegion").innerHTML = "Ошибка получения данных";
    });

    const popup = document.getElementById("InfoInPopUp");
    const offsetX = 10;
    const offsetY = 10;
    popup.style.left = `${event.pageX + offsetX}px`;
    popup.style.top = `${event.pageY + offsetY}px`;
    popup.style.display = "block";
}

const updatePopup = (regionName, count, id) => {
    document.getElementById("dynamicRegion").innerHTML = regionName;
    document.getElementById("myImage").src = `static/images/emblems/${id}.png`;
    document.getElementById("countCompany").innerHTML = count;
};

function removeRegionEventListeners() {
    const regions = document.querySelectorAll('.svg-map path');
    regions.forEach(region => {
        region.removeEventListener('mouseenter', handleMouseEnter);
        region.removeEventListener('mouseleave', handleMouseLeave);
        region.removeEventListener('click', handleClick);
    });
    document.removeEventListener('mousemove', handleMouseMove);
}

function bindRegionEvents() {
    const regions = document.querySelectorAll('.svg-map path');
    const button = document.getElementById('myButton');

    if (button.classList.contains('active')) {
        regions.forEach(region => {
            region.classList.remove('selected');
            region.setAttribute('fill', '#7D9FE8');
        });
        return;
    }

    regions.forEach(region => {
        region.addEventListener('mouseenter', handleMouseEnter);
        region.addEventListener('mouseleave', handleMouseLeave);
        region.addEventListener('click', handleClick);
    });
    document.addEventListener('mousemove', handleMouseMove);
}



document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('click', function (event) {
        var myMenu = document.getElementById('burger-menu');
        var button = document.getElementById('myButton-burger-menu');

        // Проверяем, что клик был не на меню и не на кнопке
        if (!myMenu.contains(event.target) && event.target !== button) {
            myMenu.style.display = 'none';
        }
    });

    if (window.location.pathname === '/') {
        document.getElementById('modal-error').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Страница карты
    if (window.location.pathname === '/map') {
        var svgElement = document.getElementById("mySvg");
        if (svgElement) {
            document.getElementById("InfoInPopUp").style.display = "none";
            bindRegionEvents();
        }

        // Функция для проверки видимости элемента
        function isElementVisible(el) {
            const style = window.getComputedStyle(el);
            return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0' && el.offsetHeight > 0;
        }


        setInterval(() => {
            const infoWindow = document.getElementById('myITinfo');

            if (infoWindow && isElementVisible(infoWindow)) {
                slideIndex++;
                showSlides(slideIndex);
            }
        }, 5000);
    }

    // Страница заявлений изменение/удаление
    if (window.location.pathname === '/application/update' || window.location.pathname === '/application/delete') {
        document.getElementById('phone').addEventListener('focus', function () {
            if (!this.value) {
                this.value = '+7 ';
            }
        });

        document.getElementById('phone').addEventListener('input', function (e) {
            let input = e.target.value.replace(/\D/g, '');
            let formatted = '+7';

            if (input.length > 1) {
                formatted += ' (' + input.slice(1, 4);
            }
            if (input.length > 4) {
                formatted += ') ' + input.slice(4, 7);
            }
            if (input.length > 7) {
                formatted += '-' + input.slice(7, 9);
            }
            if (input.length > 9) {
                formatted += '-' + input.slice(9, 11);
            }

            e.target.value = formatted;
        });

        document.getElementById('companyName').addEventListener('click', function () {
            document.getElementById('CompanyNameError').style.display = 'none';
        });

        document.querySelector('textarea[name="Опишите какую информацию хотите изменить"]').addEventListener('click', function () {
            document.getElementById('ProblemError').style.display = 'none';
        });

        document.getElementById('phone').addEventListener('click', function () {
            document.getElementById('PhoneError').style.display = 'none';
        });

        document.getElementById('agree').addEventListener('change', function () {
            const errorMessage = document.getElementById('PolicyError');
            if (this.checked) {
                errorMessage.style.display = 'none';
            }
        });
    }

    // Страница заявлений добавление ПО/ПАК
    if (window.location.pathname === '/application/new/applicaton-software' || window.location.pathname === '/application/new/applicaton-hardware') {

        if (window.location.pathname === '/application/new/applicaton-software') {
            document.getElementById('search-input-1').addEventListener('click', function () {
                document.getElementById('SoftClassError').style.display = 'none';
            });

            document.getElementById('search-input-2').addEventListener('click', function () {
                document.getElementById('FieldsError').style.display = 'none';
            });
        }

        if (window.location.pathname === '/application/new/applicaton-hardware') {
            document.getElementById('search-input-4').addEventListener('click', function () {
                document.getElementById('HardClassError').style.display = 'none';
            });

            document.getElementById('search-input-5').addEventListener('click', function () {
                document.getElementById('FieldsError').style.display = 'none';
            });
        }

        const companyTypeInput = document.getElementById('companyType');
        companyTypeInput.addEventListener('input', () => {
            const value = companyTypeInput.value;
            if (value) {
                companyTypeInput.value = value.charAt(0).toUpperCase() + value.slice(1);
            }
        });

        document.getElementById('phone').addEventListener('focus', function () {
            if (!this.value) {
                this.value = '+7 ';
            }
        });
        document.getElementById('phone').addEventListener('input', function (e) {
            let input = e.target.value.replace(/\D/g, '');
            let formatted = '+7';

            if (input.length > 1) {
                formatted += ' (' + input.slice(1, 4);
            }
            if (input.length > 4) {
                formatted += ') ' + input.slice(4, 7);
            }
            if (input.length > 7) {
                formatted += '-' + input.slice(7, 9);
            }
            if (input.length > 9) {
                formatted += '-' + input.slice(9, 11);
            }

            e.target.value = formatted;
        });

        document.getElementById('inn').addEventListener('input', function (e) {
            let input = e.target.value.replace(/\D/g, '');
            e.target.value = input;
        });
        
        function setCursorToEnd(input) {
            const valueLength = input.value.length;
            input.setSelectionRange(valueLength, valueLength);
        }
        
        function handleFocus(e, prefix) {
            const input = e.target;
            // Если поле пустое, добавляем префикс
            if (input.value === '') {
                input.value = prefix;
            }
            setTimeout(() => setCursorToEnd(input), 0);
        }
        
        function handleBlur(e, prefix) {
            const input = e.target;
            // Если поле не было изменено пользователем, очищаем его
            if (input.value === prefix) {
                input.value = '';
            }
        }
        
        const vkInput = document.getElementById('vk');
        vkInput.addEventListener('focus', function (e) {
            handleFocus(e, 'https://vk.com/');
        });
        vkInput.addEventListener('blur', function (e) {
            handleBlur(e, 'https://vk.com/');
        });
        vkInput.addEventListener('input', function (e) {
            const prefix = 'https://vk.com/';
            const input = e.target;
            if (!input.value.startsWith(prefix)) {
                input.value = prefix;
            }
            setCursorToEnd(input);
        });
        
        const tgInput = document.getElementById('telegram');
        tgInput.addEventListener('focus', function (e) {
            handleFocus(e, 'https://t.me/');
        });
        tgInput.addEventListener('blur', function (e) {
            handleBlur(e, 'https://t.me/');
        });
        tgInput.addEventListener('input', function (e) {
            const prefix = 'https://t.me/';
            const input = e.target;
            if (!input.value.startsWith(prefix)) {
                input.value = prefix;
            }
            setCursorToEnd(input);
        });
        
        const dzen = document.getElementById('dzen');
        dzen.addEventListener('focus', function (e) {
            handleFocus(e, 'https://dzen.ru/');
        });
        dzen.addEventListener('blur', function (e) {
            handleBlur(e, 'https://dzen.ru/');
        });
        dzen.addEventListener('input', function (e) {
            const prefix = 'https://dzen.ru/';
            const input = e.target;
            if (!input.value.startsWith(prefix)) {
                input.value = prefix;
            }
            setCursorToEnd(input);
        });
        
        const rutube = document.getElementById('rutube');
        rutube.addEventListener('focus', function (e) {
            handleFocus(e, 'https://rutube.ru/');
        });
        rutube.addEventListener('blur', function (e) {
            handleBlur(e, 'https://rutube.ru/');
        });
        rutube.addEventListener('input', function (e) {
            const prefix = 'https://rutube.ru/';
            const input = e.target;
            if (!input.value.startsWith(prefix)) {
                input.value = prefix;
            }
            setCursorToEnd(input);
        });
        

        document.getElementById('website').addEventListener('input', function (e) {
            const allowedChars = /^[a-zA-Z0-9-.:/]*$/;
            let input = e.target.value;

            if (!allowedChars.test(input)) {
                e.target.value = input.replace(/[^a-zA-Z0-9-.:/]/g, '');
            }
        });

        document.getElementById('companyName').addEventListener('click', function () {
            document.getElementById('companyNameError').style.display = 'none';
        });

        document.getElementById('companyType').addEventListener('click', function () {
            document.getElementById('companyTypeError').style.display = 'none';
        });

        document.getElementById('companyDescription').addEventListener('click', function () {
            document.getElementById('companyDescriptionError').style.display = 'none';
        });

        document.getElementById('productNames').addEventListener('click', function () {
            document.getElementById('ProductError').style.display = 'none';
        });

        document.getElementById('logo').addEventListener('click', function () {
            document.getElementById('LogoError').style.display = 'none';
        });

        document.getElementById('main_logo').addEventListener('click', function () {
            document.getElementById('MainLogoError').style.display = 'none';
        });

        document.getElementById('search-input').addEventListener('click', function () {
            document.getElementById('RegionError').style.display = 'none';
        });

        document.getElementById('address').addEventListener('click', function () {
            document.getElementById('AddressError').style.display = 'none';
        });

        document.getElementById('phone').addEventListener('click', function () {
            document.getElementById('PhoneError').style.display = 'none';
        });

        document.getElementById('website').addEventListener('click', function () {
            document.getElementById('WebsiteError').style.display = 'none';
        });

        document.getElementById('inn').addEventListener('click', function () {
            document.getElementById('INNError').style.display = 'none';
        });

        document.getElementById('agree').addEventListener('change', function () {
            const errorMessage = document.getElementById('PolicyError');
            if (this.checked) {
                errorMessage.style.display = 'none';
            }
        });
    }

    // Страница региональных представителей
    if (window.location.pathname === '/region-contacts') {
        loadRegionContacts();
    }
});

//Тумблер Российский /евразийский
function toggleState() {
    const toggleButton = document.querySelector('.toggle-button');
    toggleButton.classList.toggle('active');
    const labelLeft = document.querySelector('.label-left');
    const labelRight = document.querySelector('.label-right');
    if (toggleButton.classList.contains('active')) {
        labelLeft.style.color = 'rgba(31, 43, 106, 0.5)'; // Голубой цвет
        labelRight.style.color = 'rgba(31, 43, 106, 1)'; // Темносиний цвет
    } else {
        labelLeft.style.color = 'rgba(31, 43, 106, 1)'; // Темносиний цвет
        labelRight.style.color = 'rgba(31, 43, 106, 0.5)'; // Голубой цвет
    }
}

function myFunctionClick(id) {
    var Filter = document.getElementById('myModal');
    Filter.style.right = "1.04vw";
    
    var button = document.getElementById('hide');
    if (button) {
        button.style.right = "27vw";
    }
    
    var FilterPAK = document.getElementById('myModalPAK');
    FilterPAK.style.right = "1.04vw";
    
    var buttonPAK = document.getElementById('hidePAK');
    if (buttonPAK) {
        buttonPAK.style.right = "27vw";
    }

    // Если на экране отображается модальные окна, функция не выполняется
    var myITinfo = document.getElementById('myITinfo');
    var myList = document.getElementById('myList');
    const listItems = document.getElementById("list-items");

    var svgElement = document.getElementById("mySvg");

    if (!svgElement) {
        myList.style.display = 'none'
        myITinfo.style.display = 'none'
        window.idBlock = undefined;
        while (myITinfo.firstChild) {
            myITinfo.removeChild(myITinfo.firstChild);
        }
        while (listItems.firstChild) {
            listItems.removeChild(listItems.firstChild);
        }
    }
    else {
        if (myITinfo.style.display === 'block' || myList.style.display === 'block') {
            return;
        }
    }
    
    var buttons = document.getElementsByClassName('menu-item');

    // Сбрасываем стили для всех кнопок
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
    }

    // Делаем выбранную кнопку активной
    var button = document.getElementById(id);
    button.classList.add('active');

    var svgElement = document.getElementById("mySvg");
    if (svgElement) {
    var scale = 1;
        svgElement.style.transform = "scale(" + scale + ") translateX(0%)";
        svgElement.style.transition = "transform 1.5s";
    }

    // Обновляем id активной кнопки
    activeButtonId = id;
    sendActiveButtonId(activeButtonId)

    var myModal = document.getElementById('myModal');

    var myModalPAK = document.getElementById('myModalPAK');

    // Сбросить выбранные теги
    // Регион
    var selectedTagsContainer = document.getElementById('selected-tags');
    selectedTagsContainer.innerHTML = ''
    // Класс
    var selectedTagsContainer = document.getElementById('selected-tags-1');
    selectedTagsContainer.innerHTML = ''
    // Отрасль
    var selectedTagsContainer = document.getElementById('selected-tags-2');
    selectedTagsContainer.innerHTML = ''
    // Регион
    var selectedTagsContainer = document.getElementById('selected-tags-3');
    selectedTagsContainer.innerHTML = ''
    // Класс
    var selectedTagsContainer = document.getElementById('selected-tags-4');
    selectedTagsContainer.innerHTML = ''
    // Отрасль
    var selectedTagsContainer = document.getElementById('selected-tags-5');
    selectedTagsContainer.innerHTML = ''

    // Сбросить состояние чекбоксов
    document.getElementById('gosreg').checked = true;
    document.getElementById('AI').checked = false;
    document.getElementById('gosregPAK').checked = true;

    if (!svgElement) {
        if (id === "ButtonPO") {
            myModalPAK.style.display = 'none';
            myModal.style.display = 'block';

        }
        else {
            myModal.style.display = 'none';
            myModalPAK.style.display = 'block';
        }
    }
    else {
        myModal.style.display = 'none';
        myModalPAK.style.display = 'none';
    }

    if (window.location.pathname === '/map') {
        removeRegionEventListeners();

        const regions = document.querySelectorAll('.svg-map path');
        regions.forEach(region => {
            region.classList.remove('selected');
            region.setAttribute('fill', '#7D9FE8'); // Цвет по умолчанию
        });

        // Если кнопка не активна, привязываем события
        if (!myModal.classList.contains('active')) {
            if (svgElement) {
                bindRegionEvents();
            }
        }
    }
    
}

// Число активных записей
function sendActiveButtonId(active_button) {
    var request = new XMLHttpRequest();
    var params = 'active_button=' + active_button;

    request.open('POST', '/map', true);
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            console.log(request.responseText);
        }
    };

    request.send(params);

    request.onload = function () {
        if (request.status >= 200 && request.status < 300) {
            var response = JSON.parse(request.response);
            if (document.getElementById('dynamicNumber')) {
                document.getElementById('dynamicNumber').innerHTML = response.active_records_count;
            }
        } else {
            alert('Ошибка при отправке запроса!');
        }
    };
    
}

function myFunctionForMyButton() {
    // Если на экране отображаются модальные окна, функция не выполняется
    var myITinfo = document.getElementById('myITinfo');
    var myList = document.getElementById('myList');

    if (myITinfo.style.display === 'block' || myList.style.display === 'block') {
        return;
    }

    var button = document.getElementById('myButton');
    if (button) {
        button.classList.toggle('active'); // Переключаем класс активности на кнопке
    }

    var svgElement = document.getElementById("mySvg");

    // Когда кнопка активна
    if (button.classList.contains("active")) {
        if (svgElement) {
            var scale = 0.8; // Изменение масштаба
            svgElement.style.transform = "scale(" + scale + ") translateX(-20%)";
            svgElement.style.transition = "transform 1.5s"; // Плавная анимация
        }
    } else {
        if (svgElement) {
            var scale = 1; // Восстанавливаем исходный масштаб
            svgElement.style.transform = "scale(" + scale + ") translateX(0%)";
            svgElement.style.transition = "transform 1.5s"; // Плавная анимация
        }
    }

    if (window.location.pathname === '/map') {
        removeRegionEventListeners();

        const regions = document.querySelectorAll('.svg-map path');
        regions.forEach(region => {
            region.classList.remove('selected');
            region.setAttribute('fill', '#7D9FE8'); // Цвет по умолчанию
        });

        // Если кнопка не активна, привязываем события
        if (!button.classList.contains('active')) {
            if (svgElement) {
                bindRegionEvents();
            }
        }
    }
}
window.activeButtonId = 'ButtonPO';

// Обработчик кнопки Фильтр
document.getElementById('myButton').onclick = myFunction();

function myFunction() {
    // alert(activeButtonId); //Для проверки значения

    // Если на экране отображается модальные окна, функция не выполняется
    var myITinfo = document.getElementById('myITinfo');
    var myList = document.getElementById('myList');

    if (myITinfo.style.display === 'block' || myList.style.display === 'block') {
        return;
    }

    var myModalPAK = document.getElementById('myModalPAK');
    var myModal = document.getElementById('myModal');


    switch (activeButtonId) {
        case 'ButtonPO':
            myModal.style.display = (myModal.style.display === 'none') ? 'block' : 'none';
            myModalPAK.style.display = 'none';
            break;
        case 'ButtonPAK':
            myModalPAK.style.display = (myModalPAK.style.display === 'none') ? 'block' : 'none';
            myModal.style.display = 'none';
            break;
        default:
            myModal.style.display = 'none';
            myModalPAK.style.display = 'none';
            break;
    }
}

//ДЛЯ ОКНА ФИЛЬТРА ПО

//Кнопка свернуть
document.getElementById('hide').onclick = hideFilterFunction();

function hideFilterFunction() {
    var Filter = document.getElementById('myModal');
    var button = document.getElementById('hide');

    var myITinfo = document.getElementById('myITinfo');
    var svgElement = document.getElementById("mySvg");

    if (myModal.style.right === '1.04vw') {
        Filter.style.right = "-30vw";
        button.style.right = "0vw";

        var scale = 1; // измените это значение, чтобы установить коэффициент масштабирования
        // Добавьте это, чтобы установить плавную анимацию
        svgElement.style.transform = "scale(" + scale + ") translateX(0%)";
        svgElement.style.transition = "transform 1.5s"; // измените это значение, чтобы установить продолжительность анимации
    } else {
        Filter.style.right = "1.04vw";
        button.style.right = "27vw";

        var scale = 0.8; // измените это значение, чтобы установить коэффициент масштабирования
        // Добавьте это, чтобы установить плавную анима цию 
        svgElement.style.transform = "scale(" + scale + ") translateX(-20%)";
        svgElement.style.transition = "transform 1.5s"; // измените это значение, чтобы установить продолжительность анимации
    }

}

document.getElementById('close').onclick = closeMyModal;
// Функция для закрытия окна и очистки полей ввода и чекбоксов
function closeMyModal() {
    // Сначала удаляем старые обработчики
    if (window.location.pathname === '/map') {
        removeRegionEventListeners();
    }

    // Закрываем окно фильтра
    var myModal = document.getElementById('myModal');
    myModal.style.display = 'none';

    var button = document.getElementById('myButton');
    if (button) {
        button.classList.remove('active');
    }

    // Сбросить выбранные теги
    var selectedTagsContainer = document.getElementById('selected-tags');
    selectedTagsContainer.innerHTML = '';
    var selectedTagsContainer = document.getElementById('selected-tags-1');
    selectedTagsContainer.innerHTML = '';
    var selectedTagsContainer = document.getElementById('selected-tags-2');
    selectedTagsContainer.innerHTML = '';

    // Сбросить состояние чекбоксов
    document.getElementById('gosreg').checked = true;
    document.getElementById('AI').checked = false;
    
    var svgElement = document.getElementById("mySvg");

    // Привязываем новые обработчики только если кнопка не активна
    var myITinfo = document.getElementById('myITinfo');
    if (!myITinfo.classList.contains('active')) {
        if (svgElement) {
            bindRegionEvents();
        }
    }

    var scale = (myITinfo.style.display === 'block') ? 0.8 : 1;
    if (svgElement) {
        svgElement.style.transform = "scale(" + scale + ") translateX(" + (scale === 1 ? "0%" : "20%") + ")";
        svgElement.style.transition = "transform 1.5s";
    }
}


// Обработчик кнопки Сбросить фильтр
document.getElementById('myButtonB').onclick = myFunctionB;
function myFunctionB() {

    // Сбросить выбранные теги
    // Регион
    var selectedTagsContainer = document.getElementById('selected-tags');
    selectedTagsContainer.innerHTML = ''
    // Класс
    var selectedTagsContainer = document.getElementById('selected-tags-1');
    selectedTagsContainer.innerHTML = ''
    // Отрасль
    var selectedTagsContainer = document.getElementById('selected-tags-2');
    selectedTagsContainer.innerHTML = ''

    // Сбросить состояние чекбоксов
    document.getElementById('gosreg').checked = true;
    document.getElementById('AI').checked = false;
}

window.fields;
window.softwareclasses;
window.hardwareclasses;
window.software_ai;
window.errp;

// Обработчик кнопки Применить (оптимизирован)
document.getElementById('myButtonS').onclick = myFunctionS();
function myFunctionS() {
    // Скрыть модальное окно и сбросить стили кнопки
    document.getElementById('myModal').style.display = 'none';
    const button = document.getElementById('myButton');
    if (button) {
        button.classList.remove('active');
    }

    // Переключить отображение списка
    const myList = document.getElementById('myList');
    myList.style.display = (myList.style.display === 'none' || !myList.style.display) ? 'block' : 'none';

    // Сбор данных для фильтрации
    const tags_region = document.querySelectorAll('#selected-tags .tag');
    const regions = Array.from(tags_region).map(tag => tag.innerText.trim());

    if (regions.includes('Вся Россия')) {
        const index = regions.indexOf('Вся Россия');
        if (index > -1) {
            regions.splice(index, 1); // Удаляет 'Вся Россия' из массива
        }
    }

    const tags_softwareclass = document.querySelectorAll('#selected-tags-1 .tag');
    softwareclasses = Array.from(tags_softwareclass).map(tag => tag.innerText.trim());

    const tags_field = document.querySelectorAll('#selected-tags-2 .tag');
    fields = Array.from(tags_field).map(tag => tag.innerText.trim());

    errp = document.getElementById('gosreg').checked ? '1' : '0';
    software_ai = document.getElementById('AI').checked ? '1' : '0';

    // Отправка POST-запроса
    const request = new XMLHttpRequest();
    request.open('POST', '/filterPO');
    request.setRequestHeader('Content-Type', 'application/json');

    request.onload = function () {
        if (request.status >= 200 && request.status < 300) {
            try {
                const response = JSON.parse(request.responseText);
                console.log(response)
                console.log(response.region)
                updateHTML(response, response.region);
            } catch (e) {
                console.error('Ошибка при разборе ответа:', e);
            }
        } else {
            alert('Ошибка при отправке запроса!');
        }
    };

    request.onerror = function () {
        alert('Ошибка соединения с сервером!');
    };

    // Отправляем массив регионов в запросе
    request.send(JSON.stringify({ regions, softwareclasses, fields, errp, software_ai }));
}


// Привязываем обработчик события к списку
const listItems = document.querySelectorAll('.list-item');
listItems.forEach(item => {
    item.addEventListener('click', myFunctionInfo);
});

//ДЛЯ ОКНА ФИЛЬТРА ПАК

//Кнопка свернуть
document.getElementById('hidePAK').onclick = hideFilterFunctionPAK();
function hideFilterFunctionPAK() {
    var Filter = document.getElementById('myModalPAK');
    var button = document.getElementById('hidePAK');
    var svgElement = document.getElementById("mySvg");


    if (myModalPAK.style.right === '1.04vw') {
        Filter.style.right = "-30vw";
        button.style.right = "0vw";

        var scale = 1; // измените это значение, чтобы установить коэффициент масштабирования
        // Добавьте это, чтобы установить плавную анимацию
        svgElement.style.transform = "scale(" + scale + ") translateX(0%)";
        svgElement.style.transition = "transform 1.5s"; // измените это значение, чтобы установить продолжительность анимации
    } else {
        Filter.style.right = "1.04vw";
        button.style.right = "27vw";


        var scale = 0.8; // измените это значение, чтобы установить коэффициент масштабирования
        // Добавьте это, чтобы установить плавную анимацию 
        svgElement.style.transform = "scale(" + scale + ") translateX(-20%)";
        svgElement.style.transition = "transform 1.5s"; // измените это значение, чтобы установить продолжительность анимации
    }
}

document.getElementById('closePAK').onclick = closeMyModalPAK;
// Функция для закрытия окна и очистки полей ввода и чекбоксов
function closeMyModalPAK() {
    // Закрываем окно

    var myModal = document.getElementById('myModalPAK');
    myModal.style.display = 'none';

    var myITinfo = document.getElementById('myITinfo');
    var svgElement = document.getElementById("mySvg");

    if (myITinfo.style.display === 'block') {
        if (svgElement) {
            var scale = 0.8; // измените это значение, чтобы установить коэффициент масштабирования
            // Добавьте это, чтобы установить плавную анимацию 
            svgElement.style.transform = "scale(" + scale + ") translateX(20%)";
            svgElement.style.transition = "transform 1.5s"; // измените это значение, чтобы установить продолжительность анимации
        }
    }
    else {
        if (svgElement) {
            //Карта на весь экран
            var scale = 1; // измените это значение, чтобы установить коэффициент масштабирования
            // Добавьте это, чтобы установить плавную анимацию
            svgElement.style.transform = "scale(" + scale + ") translateX(0%)";
            svgElement.style.transition = "transform 1.5s"; // измените это значение, чтобы установить продолжительность анимации
        }
    }

    var button = document.getElementById('myButton');
    // кнопка уже активна, вернем исходные стили
    if (button) {
        button.classList.remove('active');
    }

    var myITinfo = document.getElementById('myITinfo');
    if (!myITinfo.classList.contains('active')) {
        if (svgElement) {
            bindRegionEvents();
        }
    }

    // Сбросить выбранные теги
    // Регион
    var selectedTagsContainer = document.getElementById('selected-tags-3');
    selectedTagsContainer.innerHTML = ''
    // Класс
    var selectedTagsContainer = document.getElementById('selected-tags-4');
    selectedTagsContainer.innerHTML = ''
    // Отрасль
    var selectedTagsContainer = document.getElementById('selected-tags-5');
    selectedTagsContainer.innerHTML = ''

    // Сбросить состояние чекбоксов
    document.getElementById('gosregPAK').checked = true;
}

// Обработчик кнопки Сбросить фильтр
document.getElementById('myButtonBPAK').onclick = myFunctionBPAK;
function myFunctionBPAK() {

    // Сбросить выбранные теги
    // Регион
    var selectedTagsContainer = document.getElementById('selected-tags-3');
    selectedTagsContainer.innerHTML = ''
    // Класс
    var selectedTagsContainer = document.getElementById('selected-tags-4');
    selectedTagsContainer.innerHTML = ''
    // Отрасль
    var selectedTagsContainer = document.getElementById('selected-tags-5');
    selectedTagsContainer.innerHTML = ''

    // Сбросить состояние чекбоксов
    document.getElementById('gosregPAK').checked = true;

}


// Обработчик кнопки Применить
document.getElementById('myButtonSPAK').onclick = myFunctionSPAK;
function myFunctionSPAK() {
    // Скрыть модальное окно и сбросить стили кнопки
    document.getElementById('myModalPAK').style.display = 'none';
    const button = document.getElementById('myButton');
    if (button) {
        button.classList.remove('active');
    }

    // Переключить отображение списка
    const myList = document.getElementById('myList');
    myList.style.display = (myList.style.display === 'none' || !myList.style.display) ? 'block' : 'none';

    // Сбор данных для фильтрации
    const tags_region = document.querySelectorAll('#selected-tags-3 .tag');
    const regions = Array.from(tags_region).map(tag => tag.innerText.trim());

    if (regions.includes('Вся Россия')) {
        const index = regions.indexOf('Вся Россия');
        if (index > -1) {
            regions.splice(index, 1); // Удаляет 'Вся Россия' из массива
        }
    }

    const tags_hardwareclass = document.querySelectorAll('#selected-tags-4 .tag');
    hardwareclasses = Array.from(tags_hardwareclass).map(tag => tag.innerText.trim());

    const tags_field = document.querySelectorAll('#selected-tags-5 .tag');
    fields = Array.from(tags_field).map(tag => tag.innerText.trim());

    errp = document.getElementById('gosregPAK').checked ? '1' : '0';

    // Отправка POST-запроса
    const request = new XMLHttpRequest();
    request.open('POST', '/filterPAK');
    request.setRequestHeader('Content-Type', 'application/json');

    request.onload = function () {
        if (request.status >= 200 && request.status < 300) {
            try {
                const response = JSON.parse(request.responseText);
                console.log(response)
                console.log(response.region)
                updateHTML(response, response.region);
            } catch (e) {
                console.error('Ошибка при разборе ответа:', e);
            }
        } else {
            alert('Ошибка при отправке запроса!');
        }
    };

    request.onerror = function () {
        alert('Ошибка соединения с сервером!');
    };

    // Отправляем массив регионов в запросе
    request.send(JSON.stringify({ regions, hardwareclasses, fields, errp }));
}


window.sideValue;

// Функция для отправки запроса на сервер по ID региона
function fetchCompaniesInRegion(id) {
    const svgElement = document.getElementById("mySvg");
    const parentElement = svgElement;
    const childElements = parentElement.children;

    if (activeButtonId == 'ButtonPAK') {
        fetch(`/region/${id}?button=${activeButtonId}`)
            .then(response => response.ok ? response.json() : Promise.reject('Сетевая ошибка'))
            .then(region => {

                const request = new XMLHttpRequest();
                request.open('POST', '/filterPAK');
                request.setRequestHeader('Content-Type', 'application/json');

                request.onload = function () {
                    if (request.status >= 200 && request.status < 300) {
                        try {
                            const response = JSON.parse(request.responseText);
                            console.log(response);

                            // Вместо клонирования, просто меняем стиль для каждого региона
                            for (let i = 0; i < childElements.length; i++) {
                                const child = childElements[i];
                                if (child.id !== id) {
                                    child.setAttribute('fill', 'rgba(125, 159, 232, 1)');
                                    child.classList.remove('selected');  // Удалить класс selected
                                }
                            }
                            updateHTML(response, [region]);
                        } catch (e) {
                            console.error('Ошибка при разборе ответа:', e);
                        }
                    } else {
                        console.error('Ошибка статуса:', request.status);
                        alert('Ошибка при отправке запроса!');
                    }
                };

                request.onerror = function () {
                    alert('Ошибка соединения с сервером!');
                };

                // Отправляем данные на сервер
                request.send(JSON.stringify({
                    regions: [region.name], // Используйте нужное значение для региона
                    hardwareclasses: hardwareclasses,
                    fields: fields,
                    errp: errp
                }));

            })
            .catch(error => {
                console.error('Ошибка:', error);
                document.getElementById("dynamicRegion").innerHTML = "Ошибка получения данных";
            });
    } else {
        fetch(`/region/${id}?button=${activeButtonId}`)
            .then(response => response.ok ? response.json() : Promise.reject('Сетевая ошибка'))
            .then(region => {

                const request = new XMLHttpRequest();
                request.open('POST', '/filterPO');
                request.setRequestHeader('Content-Type', 'application/json');

                request.onload = function () {
                    if (request.status >= 200 && request.status < 300) {
                        try {
                            const response = JSON.parse(request.responseText);
                            console.log(response);

                            for (let i = 0; i < childElements.length; i++) {
                                const child = childElements[i];
                                if (child.id !== id) {
                                    child.setAttribute('fill', 'rgba(125, 159, 232, 1)');
                                    child.classList.remove('selected');  // Удалить класс selected
                                }
                            }

                            updateHTML(response, [region]);
                        } catch (e) {
                            console.error('Ошибка при разборе ответа:', e);
                        }
                    } else {
                        console.error('Ошибка статуса:', request.status);
                        alert('Ошибка при отправке запроса!');
                    }
                };

                request.onerror = function () {
                    alert('Ошибка соединения с сервером!');
                };

                // Отправляем данные на сервер
                request.send(JSON.stringify({
                    regions: [region.name],
                    softwareclasses: softwareclasses,
                    fields: fields,
                    errp: errp,
                    software_ai: software_ai
                }));

            })
            .catch(error => {
                console.error('Ошибка:', error);
                document.getElementById("dynamicRegion").innerHTML = "Ошибка получения данных";
            });
    }
}



// Функция для нового фильтра Регион
function updateHTML(response, regions) {
    const listContainer = document.querySelector('.list-items');
    const countCompany = response.companies.length;
    const svgElement = document.getElementById('mySvg');
    const infoPopup = document.getElementById('InfoInPopUp');

    listContainer.innerHTML = '';

    if (response.companies.length === 0) {
        listContainer.innerHTML = '<p style="margin-left: 1.04vw;">По вашему запросу ничего не найдено.</p>';
    } else {
        response.companies.forEach(item => {
            const listItem = document.createElement('div');
            listItem.classList.add('list-item');

            const logoSrc = item.logo_company.startsWith("https://disk.yandex.ru/i/") 
                ? `https://getfile.dokpub.com/yandex/get/${item.logo_company}` 
                : item.logo_company;

            listItem.innerHTML = `
                <div class="container" id="${item.id}" onclick="myFunctionInfo(${item.id})">
                    <div class="info_container">
                        <img src="${logoSrc}" alt="Иконка">
                        <h2>${item.company_name}</h2>
                    </div>
                    <p>${item.position_company}</p>
                    <p>${item.address}</p>
                </div>
            `;

            listContainer.appendChild(listItem);
        });
    }

    const idRegions = response.region.map(region => region.abb);
    const sides = response.region.map(region => region.side);

    window.sideValue = Array.isArray(sides) && new Set(sides).size === 1 ? sides[0] : sides;

    if (svgElement) {
        if (window.sideValue === 'left') {
            svgElement.style.transition = "transform 3s";
            svgElement.style.transform = "scale(1.2) translateX(0%) translateY(-7%)";
        } else if (window.sideValue === 'right') {
            svgElement.style.transition = "transform 3s";
            svgElement.style.transform = "scale(1.05) translateX(-20%) translateY(2%)";
        } else {
            var scale = 0.8;
            svgElement.style.transform = "scale(" + scale + ") translateX(-20%)";
            svgElement.style.transition = "transform 1.5s";
        }
    

        const applyRegionStyles = (regionIds, fillColor) => {
            regionIds.forEach(id => {
                const regionElement = svgElement.getElementById(id);
                if (regionElement) {
                    regionElement.setAttribute('fill', fillColor);
                    regionElement.classList.add('selected');
                }
            });
        };

        const addRegionEventListeners = (element, id, fetchData) => {
            element.addEventListener('mouseover', event => {
                // Проверяем, является ли регион выбранным
                if (element.classList.contains('selected')) {
                    if (fetchData) {
                        const params = new URLSearchParams({
                            button: activeButtonId,
                            errp: errp,
                        });

                        fields.forEach(field => {
                            params.append('fields[]', field);
                        });

                        fetch(`/region/${id}?${params}`)
                            .then(response => response.ok ? response.json() : Promise.reject('Сетевая ошибка'))
                            .then(region => {
                                updatePopup(region.name, region.count, id);
                                showPopup(event);
                            })
                            .catch(error => {
                                console.error('Ошибка:', error);
                                document.getElementById("dynamicRegion").innerHTML = "Ошибка получения данных";
                            });
                    } else {
                        updatePopup(id, countCompany, id);
                        showPopup(event);
                    }
                }
            });

            element.addEventListener('mouseout', () => {
                if (!infoPopup.matches(':hover')) {
                    hidePopup();
                }
            });

            element.addEventListener('mousemove', updatePopupPosition);

            element.addEventListener('click', () => {
                const infoElement = document.getElementById('myITinfo');

                if (element.classList.contains('selected')) {
                    if (infoElement.style.display === 'none' || !infoElement.style.display) {
                        if (regions.length !== 1) {
                            clearListItems();
                            fetchCompaniesInRegion(id);
                        }
                    }
                }
            });

            function clearListItems() {
                const listItems = document.getElementById("list-items");
                while (listItems.firstChild) {
                    listItems.removeChild(listItems.firstChild);
                }
            }
        };

        const updatePopup = (regionName, count, id) => {
            document.getElementById("dynamicRegion").innerHTML = regionName;
            document.getElementById("myImage").src = `static/images/emblems/${id}.png`;
            document.getElementById("countCompany").innerHTML = count;
        };

        const showPopup = event => {
            if (infoPopup.style.display !== 'block') {
                updatePopupPosition(event);
                infoPopup.style.display = 'block';
            }
        };

        const hidePopup = () => {
            if (!infoPopup.matches(':hover')) {
                infoPopup.style.display = 'none';
            }
        };

        const updatePopupPosition = event => {
            infoPopup.style.top = `${event.clientY + 10}px`;
            infoPopup.style.left = `${event.clientX + 10}px`;
        };

        if (regions.includes('Вся Россия')) {
            applyRegionStyles(idRegions, 'rgba(80, 79, 217, 1)');
            idRegions.forEach(id => {
                const regionElement = svgElement.getElementById(id);
                if (regionElement) {
                    addRegionEventListeners(regionElement, id, true);
                }
            });
        } else {
            idRegions.forEach(id => {
                const regionElement = svgElement.getElementById(id);
                if (regionElement) {
                    addRegionEventListeners(regionElement, id, true);
                }
            });

            applyRegionStyles(idRegions, "rgba(80, 79, 217, 1)");
        }

        // Обработчики для мыши (подобные handleMouseEnter и handleMouseLeave)
        function handleMouseEnter(event) {
            const region = event.target;
            const popup = document.getElementById("InfoInPopUp");

            // Показываем попап только для выбранных регионов
            if (region.classList.contains('selected')) {
                const params = new URLSearchParams({
                    button: activeButtonId
                });

                const id = region.id;

                fetch(`/region/${region.id}?${params}`)
                    .then(response => response.ok ? response.json() : Promise.reject('Сетевая ошибка'))
                    .then(region => {
                        updatePopup(region.name, region.count, id);
                    })
                    .catch(error => {
                        console.error('Ошибка:', error);
                        document.getElementById("dynamicRegion").innerHTML = "Ошибка получения данных";
                    });

                popup.style.display = "block";
            } else {
                popup.style.display = "none";
            }

            const offsetX = 10;
            const offsetY = 10;
            popup.style.left = `${event.pageX + offsetX}px`;
            popup.style.top = `${event.pageY + offsetY}px`;
        }

        function handleMouseMove(event) {
            const popup = document.getElementById("InfoInPopUp");

            const offsetX = 10;
            const offsetY = 10;
            popup.style.left = `${event.pageX + offsetX}px`;
            popup.style.top = `${event.pageY + offsetY}px`;
        }

        function handleMouseLeave(event) {
            const region = event.target;
            const popup = document.getElementById("InfoInPopUp");

            const selectedRegion = document.querySelector('.svg-map path.selected');

            // Проверяем, что курсор не находится на выбранном регионе и не над попапом
            if (!selectedRegion || !selectedRegion.contains(event.relatedTarget)) {
                popup.style.display = "none";
            }

            if (!region.classList.contains('selected')) {
                region.setAttribute('fill', '#7D9FE8');
            }
        }

        // Применение обработчиков событий
        const regionsElements = document.querySelectorAll('.svg-map path');
        regionsElements.forEach(region => {
            region.addEventListener('mouseenter', handleMouseEnter);
            region.addEventListener('mouseleave', handleMouseLeave);
            region.addEventListener('mousemove', handleMouseMove);
        });
    }
}




// Обработчик кнопки назад на списке (оптимизирован)
function myFunctionBack() {
    // Сбрасываем глобальную переменную
    window.idBlock = undefined;
    const svgElement = document.getElementById("mySvg");
    document.getElementById("myITinfo").style.display = "none";

    if (svgElement) {
        var scale = 0.8; // измените это значение, чтобы установить коэффициент масштабирования
        svgElement.style.transform = "scale(" + scale + ") translateX(-20%)";
        svgElement.style.transition = "transform 1.5s";

        const parentElement = svgElement;
        const childElements = parentElement.children;

        // Удаляем старые обработчики событий и сбрасываем цвета
        for (let i = 0; i < childElements.length; i++) {
            const child = childElements[i];
        
            // Создаём новый элемент с теми же атрибутами
            const newChild = child.cloneNode(false);
            while (child.firstChild) {
                newChild.appendChild(child.firstChild);
            }
        
            // Заменяем элемент
            child.replaceWith(newChild);
        
            // Сбрасываем стили
            newChild.setAttribute('fill', 'rgba(125, 159, 232, 1)'); // Принудительно устанавливаем атрибут
        }

    }

    // Скрываем список
    document.getElementById("myList").style.display = "none";

    const myModal = document.getElementById('myModal');
    const myModalPAK = document.getElementById('myModalPAK');
    if (activeButtonId === "ButtonPAK") {
        myModalPAK.style.display = 'block';
    } else {
        myModal.style.display = 'block';
    }

    button = document.getElementById('myButton')
    // Переключаем класс "active" на кнопку
    if (button) {
        button.classList.toggle('active');
    }

    // Очищаем список элементов
    const listItems = document.getElementById("list-items");
    while (listItems.firstChild) {
        listItems.removeChild(listItems.firstChild);
    }

    // Привязываем обработчики событий для новых элементов, если нужно
    if (window.location.pathname === '/map') {
        if (svgElement) {
            bindRegionEvents();  // Привязка событий для карты, если они еще не привязаны
        }
    }
}


//Появление блока инфо (оптимизирован)
function myFunctionInfo(id) {
    const myITinfo = document.getElementById('myITinfo');
    const myBlock = document.getElementById(id);
    const svgElement = document.getElementById("mySvg");

    const myList = document.getElementById('myList')

    const element = document.getElementById(window.idBlock);
    if (element) {
        element.style.backgroundColor = '';
    }

    while (myITinfo.firstChild) {
        myITinfo.removeChild(myITinfo.firstChild);
    }

    const isNewBlock = id !== window.idBlock;

    if (id === window.idBlock) {
        window.idBlock = undefined;
    }
    const displayBlockInfo = isNewBlock || myITinfo.style.display === 'none';

    if (displayBlockInfo) {
        myITinfo.style.display = 'block';
        myBlock.style.backgroundColor = 'rgba(240, 242, 255, 1)';
        // svgElement.style.transform = "scale(0.5) translateX(0%)";
        if (svgElement) {
            if (window.sideValue === 'left') {
                //Анимация приближения левой части после открытия левого окна инфомации
                var scale = 1.2; // измените это значение, чтобы установить коэффициент масштабирования
                // // Добавьте это, чтобы установить плавную анимацию
                svgElement.style.transition = "transform 1.5s"; // измените это значение, чтобы установить продолжительность анимации
                svgElement.style.transform = "scale(" + scale + ") translateX(21%) translateY(-7%)";
            } else if (window.sideValue === 'right') {
            } else {
                svgElement.style.transform = "scale(0.6) translateX(0%)";
            }
        }
        else {
            myList.style.display = 'none'
        }
    } else {
        if (svgElement) {
            if (window.sideValue === 'left') {
                //Анимация приближения левой части после открытия левого окна инфомации
                var scale = 1.2; // измените это значение, чтобы установить коэффициент масштабирования
                // // Добавьте это, чтобы установить плавную анимацию
                svgElement.style.transition = "transform 1.5s"; // измените это значение, чтобы установить продолжительность анимации
                svgElement.style.transform = "scale(" + scale + ") translateX(0%) translateY(-7%)";
            } else if (window.sideValue === 'right') {
            } else {
                var scale = 0.8; // измените это значение, чтобы установить коэффициент масштабирования
                // Добавьте это, чтобы установить плавную анимацию 
                svgElement.style.transform = "scale(" + scale + ") translateX(-20%)";
                svgElement.style.transition = "transform 1.5s"; // измените это значение, чтобы установить продолжительность анимации
            }
        }
        myITinfo.style.display = 'none';
        myBlock.style.backgroundColor = '';
            // svgElement.style.transform = "scale(0.8) translateX(-20%)";
    }

    // svgElement.style.transition = "transform 1.5s";

    if (isNewBlock) {
        const request = new XMLHttpRequest();
        request.open('POST', '/info', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                const response = JSON.parse(request.responseText);
                console.log(response);
                infoHTML(response);
            } else if (request.readyState === 4) {
                alert('Ошибка при отправке запроса!');
            }
        };

        request.send(JSON.stringify({ idCompany: id }));
        window.idBlock = id;
    }
}

l// Объявление переменной slideIndex вне функции, чтобы она была доступна глобально

function currentSlide(n) {
    showSlides(slideIndex = n); // Здесь slideIndex будет обновляться
}

function showSlides(n) {
    const slides = document.querySelectorAll('.mySlides');
    const dots = document.querySelectorAll('.dot');

    slides.forEach(slide => slide.style.display = "none");
    dots.forEach(dot => dot.classList.remove('active'));

    if (n > slides.length) {
        slideIndex = 1;
    }
    if (n < 1) {
        slideIndex = slides.length;
    }

    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].classList.add('active');
}

//Вывод информации о компании
function infoHTML(response) {
    const listContainer = document.querySelector('.info');
    slideIndex = 0;

    response.forEach(item => {
        const listItem = document.createElement('div');
        listItem.classList.add('myITinfo');

        function getYandexFileUrl(url) {
            return url.startsWith("https://disk.yandex.ru/i/") 
                ? `https://getfile.dokpub.com/yandex/get/${url}` 
                : url;
        }
        
        listItem.innerHTML = `
            <div class="informations">
                <svg class="close" id="close" width="18" height="18" viewBox="0 0 18 18" fill="none"
                    xmlns="http://www.w3.org/2000/svg" onclick="closeMyModalInfo()"
                    style="position: absolute; top: 0.52vw; right: 0.52vw; z-index: 9999;">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M17.7728 1.32372C18.0756 1.0209 18.0756 0.529933 17.7728 0.227114C17.47 -0.0757047 16.979 -0.0757047 16.6762 0.227114L8.99974 7.90357L1.32372 0.227552C1.0209 -0.0752664 0.529933 -0.0752668 0.227114 0.227552C-0.0757048 0.530371 -0.0757044 1.02134 0.227114 1.32416L7.90313 9.00017L0.22714 16.6762C-0.0756778 16.979 -0.0756782 17.47 0.227141 17.7728C0.529959 18.0756 1.02093 18.0756 1.32374 17.7728L8.99974 10.0968L16.6762 17.7732C16.979 18.076 17.47 18.076 17.7728 17.7732C18.0756 17.4704 18.0756 16.9794 17.7728 16.6766L10.0963 9.00017L17.7728 1.32372Z"
                        fill="#383874" fill-opacity="0.2" />
                </svg>
                <div class="slideshow-container">
                    <div class="mySlides fade" style="display: block;">
                        <video autoplay muted loop id="myVideo" src="${getYandexFileUrl(item.video)}"></video>
                    </div>
                    <div class="mySlides fade">
                        <img src="${getYandexFileUrl(item.main_logo_image)}" width="100%">
                    </div>
                    <div class="mySlides fade">
                        <img src="${getYandexFileUrl(item.second_image)}" width="100%">
                    </div>
                    <div class="mySlides fade">
                        <img src="${getYandexFileUrl(item.third_image)}" width="100%">
                    </div>
                    <div class="mySlides fade">
                        <img src="${getYandexFileUrl(item.fourth_image)}" width="100%">
                    </div>
                </div>
        <br>
        <div class="dots" style="text-align:center">
            <span class="dot active" onclick="currentSlide(1)"></span>
            <span class="dot" onclick="currentSlide(2)"></span>
            <span class="dot" onclick="currentSlide(3)"></span>
            <span class="dot" onclick="currentSlide(4)"></span>
            <span class="dot" onclick="currentSlide(5)"></span>
        </div>
        <div class="textInfo">
            <h1>${item.company_name}</h1>
            <span>${item.position_company}</span>
            <svg class="line" xmlns="http://www.w3.org/2000/svg" width="23.96vw" height="1" viewBox="0 0 460 1"
                fill="none">
                <line y1="0.5" x2="460" y2="0.5" stroke="#383874" stroke-opacity="0.5" />
            </svg>
            <h2>О компании</h2>
            <p id="about-${item.id}" class="сollapsed">${item.description}</p>
            <button id="toggleButton-${item.id}" class = "Buttonpokazat hidden">Показать ещё</button>
            <svg class="line" xmlns="http://www.w3.org/2000/svg" width="23.96vw" height="1" viewBox="0 0 460 1"
                fill="none">
                <line x1="-4.37114e-08" y1="0.5" x2="460" y2="0.49996" stroke="#383874" stroke-opacity="0.2" />
            </svg>
            <h2>Продукты компании</h2>
            <ul id="product-list-${item.id}" class="collapsed-list">
                ${listResult(item.product)}
            </ul>
            <button id="toggleProductButton-${item.id}" class="Buttonpokazat">Показать ещё</button>
         
            <svg class="line" xmlns="http://www.w3.org/2000/svg" width="23.96vw" height="1" viewBox="0 0 460 1"
                fill="none">
                <line x1="-4.37114e-08" y1="0.5" x2="460" y2="0.49996" stroke="#383874" stroke-opacity="0.2" />
            </svg>
            <h2>Услуги компании</h2>
            <ul id="service-list-${item.id}" class="collapsed-list">
                ${listResult(item.service)}
            </ul>
            <button id="toggleServiceButton-${item.id}" class = "Buttonpokazat">Показать ещё</button>
            <svg class="line" xmlns="http://www.w3.org/2000/svg" width="23.96vw" height="1" viewBox="0 0 460 1"
                fill="none">
                <line x1="-4.37114e-08" y1="0.5" x2="460" y2="0.49996" stroke="#383874" stroke-opacity="0.2" />
            </svg>
        </div>
        <div class="links">
        </div>
        </div>
        `;

        listContainer.appendChild(listItem);

        // Вызов функции generateICON после добавления элемента в DOM
        generateICON(item.id);

        // Обновление видимости
        updateVisibility(item.id);
        updateListVisibility(`product-list-${item.id}`, `toggleProductButton-${item.id}`);
        updateListVisibility(`service-list-${item.id}`, `toggleServiceButton-${item.id}`);

        // Обработчики событий для кнопок
        setupToggleButton(`toggleButton-${item.id}`, `about-${item.id}`);
        setupToggleButton(`toggleProductButton-${item.id}`, `product-list-${item.id}`);
        setupToggleButton(`toggleServiceButton-${item.id}`, `service-list-${item.id}`);
    });

    // Обработчик изменения размера окна
    window.addEventListener('resize', () => {
        response.forEach(item => {
            updateVisibility(item.id);
            updateListVisibility(`product-list-${item.id}`, `toggleProductButton-${item.id}`);
            updateListVisibility(`service-list-${item.id}`, `toggleServiceButton-${item.id}`);
        });
    });
}


// Видиомсть кнопки "Показать ещё"
function updateVisibility(id) {
    const textElement = document.getElementById(`about-${id}`);
    const toggleButton = document.getElementById(`toggleButton-${id}`);
    if (!textElement || !toggleButton) return;

    const text = textElement.innerText || textElement.textContent;
    const lines = text.split('. ');
    const numberOfLines = lines.length;

    const maxHeight = 2; // Количество видимых строк по умолчанию

    if (numberOfLines <= maxHeight) {
        textElement.classList.remove('collapsed');
        textElement.classList.add('expanded');
        toggleButton.classList.add('hidden'); // Скрыть кнопку
    } else {
        textElement.classList.add('collapsed');
        textElement.classList.remove('expanded');
        toggleButton.classList.remove('hidden'); // Показать кнопку
    }
}

// Видимость текста для кнопки "Показать ещё"
function updateListVisibility(listId, buttonId) {
    const list = document.getElementById(listId);
    const toggleButton = document.getElementById(buttonId);
    if (!list || !toggleButton) return;

    const items = list.querySelectorAll('li');
    const visibleItems = 2; // Количество видимых элементов по умолчанию

    // Скрыть все элементы, кроме первых двух
    items.forEach((item, index) => {
        item.style.display = index < visibleItems ? 'list-item' : 'none';
    });

    // Показать или скрыть кнопку в зависимости от количества элементов
    if (items.length > visibleItems) {
        list.classList.add('collapsed-list');
        toggleButton.classList.remove('hidden');
        toggleButton.textContent = 'Показать ещё';
    } else {
        list.classList.remove('collapsed-list');
        toggleButton.classList.add('hidden');
    }
}

// Обработчик кнопки "Показать ещё"
function setupToggleButton(buttonId, targetId) {
    const button = document.getElementById(buttonId);
    if (!button) return;

    button.onclick = () => {
        const targetElement = document.getElementById(targetId);
        const isCollapsed = targetElement.classList.contains('collapsed') || targetElement.classList.contains('collapsed-list');
        const visibleItems = 2; // Количество видимых элементов по умолчанию

        if (targetElement.tagName === 'P') { // Текстовое описание
            if (isCollapsed) {
                targetElement.classList.remove('collapsed');
                targetElement.classList.add('expanded');
                button.textContent = 'Свернуть';
            } else {
                targetElement.classList.remove('expanded');
                targetElement.classList.add('collapsed');
                button.textContent = 'Показать ещё';
            }
        } else { // Списки продуктов и услуг
            const items = targetElement.querySelectorAll('li');
            items.forEach((item, index) => {
                item.style.display = isCollapsed || index < visibleItems ? 'list-item' : 'none';
            });

            if (isCollapsed) {
                targetElement.classList.remove('collapsed-list');
                targetElement.classList.add('expanded-list');
                button.textContent = 'Свернуть';
            } else {
                targetElement.classList.add('collapsed-list');
                targetElement.classList.remove('expanded-list');
                button.textContent = 'Показать ещё';
            }
        }
    };
}

//Вывод списка через маркер (оптимизирован)
function listResult(items) {
    // Разделяем строку на элементы списка по символу ';'
    const matches = items.split(';').map(item => item.trim()).filter(Boolean);

    return matches.map(item => `<li>${item}</li>`).join('');
}

//Отправка запроса об иконках на сервер (оптимизирован)
function generateICON(id) {
    const request = new XMLHttpRequest();
    request.open('GET', `/icon/${id}`);

    request.onload = function () {
        if (request.status === 200) {
            try {
                const response = JSON.parse(request.responseText);
                console.log(response);
                updateICON(response);
            } catch (e) {
                console.error('Ошибка при разборе ответа:', e);
            }
        } else if (request.status === 404) {
            console.log('Компания не найдена!');
        } else {
            alert('Ошибка при отправке запроса!');
        }
    };

    request.onerror = function () {
        alert('Ошибка соединения с сервером!');
    };

    request.send();
}


//Вывод иконок на страницу (оптимизирован)
function updateICON(response) {
    const listContainer = document.querySelector('.links');
    listContainer.innerHTML = '';

    const iconData = [
        { key: 'rutube', src: 'Ico_Rutube.png' },
        { key: 'telegram', src: 'Ico_Telegram.png' },
        { key: 'dzen', src: 'Ico_Dzen.png' },
        { key: 'vk', src: 'Ico_VK.png' },
        { key: 'site', src: 'Ico_Browser.png' }
    ];

    iconData.forEach(({ key, src }) => {
        if (response[key]) {
            const listItem = document.createElement('div');
            listItem.classList.add('link');
            listItem.innerHTML = `
                <a href="${response[key]}/" target="_blank">
                    <img class="link-icon" src="static/images/${src}">
                </a>
            `;
            listContainer.appendChild(listItem);
        }
    });

    const staticLinksHtml = `
        <div class="link"><img class="link-icon" src="../static/images/Ico_Save.png"></div>
        <div class="link"><img class="link-icon" src="../static/images/Ico_Send.png"></div>
    `;
    listContainer.insertAdjacentHTML('beforeend', staticLinksHtml);
}

document.getElementById('close').onclick = closeMyModalInfo;
// Функция для закрытия окна инфо
function closeMyModalInfo() {
    // Закрываем окно
    const listItems = document.querySelectorAll('.container');
    listItems.forEach((element) => {
        element.style.backgroundColor = ''; // Возвращаем начальный цвет  
    });

    window.idBlock = undefined;

    var myModal = document.getElementById('myITinfo');
    myModal.style.display = 'none';
    myITinfo.style.display = 'none';

    var info = document.getElementById("myITinfo")
    while (info.firstChild) {
        info.removeChild(info.firstChild)
    }

    var svgElement = document.getElementById("mySvg");

    if (svgElement) {

        if (window.sideValue === 'left') {
            //Анимация приближения левой части после открытия левого окна инфомации
            var scale = 1.2; // измените это значение, чтобы установить коэффициент масштабирования
            // // Добавьте это, чтобы установить плавную анимацию
            svgElement.style.transition = "transform 1.5s"; // измените это значение, чтобы установить продолжительность анимации
            svgElement.style.transform = "scale(" + scale + ") translateX(0%) translateY(-7%)";
        } else if (window.sideValue === 'right') {

        } else {
            var scale = 0.8; // измените это значение, чтобы установить коэффициент масштабирования
            // Добавьте это, чтобы установить плавную анимацию 
            svgElement.style.transform = "scale(" + scale + ") translateX(-20%)";
            svgElement.style.transition = "transform 1.5s"; // измените это значение, чтобы установить продолжительность анимации
        }
    }

    const myList = document.getElementById('myList')
    if (myList.style.display === 'none') {
        myList.style.display = 'block'
    }
}

//Поиск
// Обработчик кнопки Выбрать
document.getElementById('selectButtonRegion').onclick = searchListRegion;

//Работа поиска Регионы
function searchListRegionGeneral(inputId, listContainerId, selectButtonId, toggleSearchContainerFunction) {
    const listItemsRegion = [
        "Вся Россия",
        "Республика Адыгея",
        "Республика Алтай",
        "Республика Башкортостан",
        "Республика Бурятия",
        "Республика Дагестан",
        "Республика Ингушетия",
        "Кабардино-Балкарская Республика",
        "Республика Калмыкия",
        "Карачаево-Черкесская Республика",
        "Республика Карелия",
        "Республика Коми",
        "Республика Крым",
        "Республика Марий Эл",
        "Республика Мордовия",
        "Республика Саха (Якутия)",
        "Республика Северная Осетия - Алания",
        "Республика Татарстан",
        "Республика Тыва",
        "Удмуртская Республика",
        "Республика Хакасия",
        "Чеченская Республика",
        "Чувашская Республика",
        "Алтайский край",
        "Забайкальский край",
        "Камчатский край",
        "Краснодарский край",
        "Красноярский край",
        "Пермский край",
        "Приморский край",
        "Ставропольский край",
        "Хабаровский край",
        "Амурская область",
        "Архангельская область",
        "Астраханская область",
        "Белгородская область",
        "Брянская область",
        "Владимирская область",
        "Волгоградская область",
        "Вологодская область",
        "Воронежская область",
        "Запорожская область",
        "Ивановская область",
        "Иркутская область",
        "Калининградская область",
        "Калужская область",
        "Кемеровская область",
        "Кировская область",
        "Костромская область",
        "Курганская область",
        "Курская область",
        "Ленинградская область",
        "Липецкая область",
        "Магаданская область",
        "Московская область",
        "Мурманская область",
        "Нижегородская область",
        "Новгородская область",
        "Новосибирская область",
        "Омская область",
        "Оренбургская область",
        "Орловская область",
        "Пензенская область",
        "Псковская область",
        "Ростовская область",
        "Рязанская область",
        "Самарская область",
        "Саратовская область",
        "Сахалинская область",
        "Свердловская область",
        "Смоленская область",
        "Тамбовская область",
        "Тверская область",
        "Томская область",
        "Тульская область",
        "Тюменская область",
        "Ульяновская область",
        "Херсонская область",
        "Челябинская область",
        "Ярославская область",
        "Москва",
        "Санкт-Петербург",
        "Еврейская автономная область",
        "Ненецкий автономный округ",
        "Ханты-Мансийский автономный округ - Югра",
        "Чукотский автономный округ",
        "Ямало-Ненецкий автономный округ",
        "Донецкая народная республика",
        "Луганская народная республика"
    ];

    const input = document.getElementById(inputId);
    const filter = input.value.toUpperCase();
    const ul = document.getElementById(listContainerId);
    ul.innerHTML = '';

    const sortedItems = listItemsRegion
        .map(item => {
            const matchIndex = item.toUpperCase().indexOf(filter);
            if (matchIndex !== -1) {
                const beforeMatch = item.substring(0, matchIndex);
                const matchText = item.substring(matchIndex, matchIndex + filter.length);
                const afterMatch = item.substring(matchIndex + filter.length);
                return {
                    item,
                    itemHtml: beforeMatch + '<span class="highlight">' + matchText + '</span>' + afterMatch,
                    matchIndex
                };
            }
            return { item, matchIndex: -1 };
        })
        .filter(item => item.matchIndex !== -1)
        .sort((a, b) => a.matchIndex - b.matchIndex);

    sortedItems.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = item.itemHtml;
        li.addEventListener('click', () => {
            document.getElementById(selectButtonId).innerText = item.item;
            toggleSearchContainerFunction();
        });
        ul.appendChild(li);
    });
}

function searchListRegion() {
    searchListRegionGeneral('searchInputRegion', 'listContainerRegion', 'selectButtonRegion', toggleSearchContainerRegion);
}

function toggleSearchContainerRegion() {
    const container = document.getElementById('searchContainerRegion');
    container.style.display = container.style.display === 'none' ? 'block' : 'none';
}

// Обработчик кнопки Выбрать
document.getElementById('selectButtonClassPO').onclick = searchListClassPO;

//Работа поиска Класс ПО
function searchListClassPO() {
    const listItemsNameClassPO = [
        "Все",
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

    const input = document.getElementById('searchInputClassPO');
    const filter = input.value.toUpperCase();
    const ul = document.getElementById('listContainerClassPO');
    ul.innerHTML = '';

    const sortedItems = listItemsNameClassPO
        .map(item => {
            const matchIndex = item.toUpperCase().indexOf(filter);
            if (matchIndex !== -1) {
                const beforeMatch = item.substring(0, matchIndex);
                const matchText = item.substring(matchIndex, matchIndex + filter.length);
                const afterMatch = item.substring(matchIndex + filter.length);
                return {
                    item,
                    itemHtml: beforeMatch + '<span class="highlight">' + matchText + '</span>' + afterMatch,
                    matchIndex
                };
            }
            return { item, matchIndex: -1 };
        })
        .filter(item => item.matchIndex !== -1)
        .sort((a, b) => a.matchIndex - b.matchIndex);

    sortedItems.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = item.itemHtml;
        li.addEventListener('click', () => {
            document.getElementById('selectButtonClassPO').innerText = item.item;
            toggleSearchContainerClassPO();
        });
        ul.appendChild(li);
    });
}

function toggleSearchContainerClassPO() {
    const container = document.getElementById('searchContainerClassPO');
    container.style.display = container.style.display === 'none' ? 'block' : 'none';
}



//Поиск для ПАК
// Обработчик кнопки Выбрать
document.getElementById('selectButtonRegionPAK').onclick = searchListRegionPAK;

//Работа поиска Регионы
function searchListRegionPAK() {
    searchListRegionGeneral('searchInputRegionPAK', 'listContainerRegionPAK', 'selectButtonRegionPAK', toggleSearchContainerRegionPAK);
}

function toggleSearchContainerRegionPAK() {
    const container = document.getElementById('searchContainerRegionPAK');
    container.style.display = container.style.display === 'none' ? 'block' : 'none';
}

//Работа поиска Отрасль
function searchListExperience() {

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


    const input = document.getElementById('searchInputExperience');
    const filter = input.value.toUpperCase();
    const ul = document.getElementById('listContainerExperience');
    ul.innerHTML = '';

    const sortedItems = listItemsTypeExperience
        .map(item => {
            const matchIndex = item.toUpperCase().indexOf(filter);
            if (matchIndex !== -1) {
                const beforeMatch = item.substring(0, matchIndex);
                const matchText = item.substring(matchIndex, matchIndex + filter.length);
                const afterMatch = item.substring(matchIndex + filter.length);
                return {
                    item,
                    itemHtml: beforeMatch + '<span class="highlight">' + matchText + '</span>' + afterMatch,
                    matchIndex
                };
            }
            return { item, matchIndex: -1 };
        })
        .filter(item => item.matchIndex !== -1)
        .sort((a, b) => a.matchIndex - b.matchIndex);

    sortedItems.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = item.itemHtml;
        li.addEventListener('click', () => {
            document.getElementById('selectButtonExperience').innerText = item.item;
            toggleSearchContainerExperience();
        });
        ul.appendChild(li);
    });
}

function toggleSearchContainerExperience() {
    const container = document.getElementById('searchContainerExperience');
    container.style.display = container.style.display === 'none' ? 'block' : 'none';
}



//новый поиск
//Обработчик кнопки ПО Регионы

document.getElementById('clickPOR').onclick = clickPOR;

function clickPOR() {
    const searchInput = document.getElementById('search-input');
    const dropdownList = document.getElementById('dropdown-list');
    const selectedTagsContainer = document.getElementById('selected-tags');
    const dropdown = document.getElementById('dropdown');
    const noResults = document.getElementById('no-results');

    const regions = [
        "Вся Россия",
        "Республика Адыгея",
        "Республика Алтай",
        "Республика Башкортостан",
        "Республика Бурятия",
        "Республика Дагестан",
        "Республика Ингушетия",
        "Кабардино-Балкарская Республика",
        "Республика Калмыкия",
        "Карачаево-Черкесская Республика",
        "Республика Карелия",
        "Республика Коми",
        "Республика Крым",
        "Республика Марий Эл",
        "Республика Мордовия",
        "Республика Саха (Якутия)",
        "Республика Северная Осетия - Алания",
        "Республика Татарстан",
        "Республика Тыва",
        "Удмуртская Республика",
        "Республика Хакасия",
        "Чеченская Республика",
        "Чувашская Республика",
        "Алтайский край",
        "Забайкальский край",
        "Камчатский край",
        "Краснодарский край",
        "Красноярский край",
        "Пермский край",
        "Приморский край",
        "Ставропольский край",
        "Хабаровский край",
        "Амурская область",
        "Архангельская область",
        "Астраханская область",
        "Белгородская область",
        "Брянская область",
        "Владимирская область",
        "Волгоградская область",
        "Вологодская область",
        "Воронежская область",
        "Запорожская область",
        "Ивановская область",
        "Иркутская область",
        "Калининградская область",
        "Калужская область",
        "Кемеровская область",
        "Кировская область",
        "Костромская область",
        "Курганская область",
        "Курская область",
        "Ленинградская область",
        "Липецкая область",
        "Магаданская область",
        "Московская область",
        "Мурманская область",
        "Нижегородская область",
        "Новгородская область",
        "Новосибирская область",
        "Омская область",
        "Оренбургская область",
        "Орловская область",
        "Пензенская область",
        "Псковская область",
        "Ростовская область",
        "Рязанская область",
        "Самарская область",
        "Саратовская область",
        "Сахалинская область",
        "Свердловская область",
        "Смоленская область",
        "Тамбовская область",
        "Тверская область",
        "Томская область",
        "Тульская область",
        "Тюменская область",
        "Ульяновская область",
        "Херсонская область",
        "Челябинская область",
        "Ярославская область",
        "Москва",
        "Санкт-Петербург",
        "Еврейская автономная область",
        "Ненецкий автономный округ",
        "Ханты-Мансийский автономный округ - Югра",
        "Чукотский автономный округ",
        "Ямало-Ненецкий автономный округ",
        "Донецкая народная республика",
        "Луганская народная республика"

    ];

    function populateDropdown() {
        const filter = searchInput.value.toUpperCase();
        dropdownList.innerHTML = '';
        const sortedItems = regions
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
        const icon = document.getElementById('dropdown-icon');
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

//Обработчик ПО название класса
document.getElementById('clickPONAME').onclick = clickPONAME;


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

//Обработчик ПО отрасль
document.getElementById('clickPOOTRASL').onclick = clickPOOTRASL;


function clickPOOTRASL() {
    const searchInput = document.getElementById('search-input-2');
    const dropdownList = document.getElementById('dropdown-list-2');
    const selectedTagsContainer = document.getElementById('selected-tags-2');
    const dropdown = document.getElementById('dropdown-2');
    const noResults = document.getElementById('no-results-2');

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
        const icon = document.getElementById('dropdown-icon-2');
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

//Обработчик кнопки ПАК Регионы

document.getElementById('clickPAKR').onclick = clickPAKR;

function clickPAKR() {
    const searchInput = document.getElementById('search-input-3');
    const dropdownList = document.getElementById('dropdown-list-3');
    const selectedTagsContainer = document.getElementById('selected-tags-3');
    const dropdown = document.getElementById('dropdown-3');
    const noResults = document.getElementById('no-results-3');

    const regions = [
        "Вся Россия",
        "Республика Адыгея",
        "Республика Алтай",
        "Республика Башкортостан",
        "Республика Бурятия",
        "Республика Дагестан",
        "Республика Ингушетия",
        "Кабардино-Балкарская Республика",
        "Республика Калмыкия",
        "Карачаево-Черкесская Республика",
        "Республика Карелия",
        "Республика Коми",
        "Республика Крым",
        "Республика Марий Эл",
        "Республика Мордовия",
        "Республика Саха (Якутия)",
        "Республика Северная Осетия - Алания",
        "Республика Татарстан",
        "Республика Тыва",
        "Удмуртская Республика",
        "Республика Хакасия",
        "Чеченская Республика",
        "Чувашская Республика",
        "Алтайский край",
        "Забайкальский край",
        "Камчатский край",
        "Краснодарский край",
        "Красноярский край",
        "Пермский край",
        "Приморский край",
        "Ставропольский край",
        "Хабаровский край",
        "Амурская область",
        "Архангельская область",
        "Астраханская область",
        "Белгородская область",
        "Брянская область",
        "Владимирская область",
        "Волгоградская область",
        "Вологодская область",
        "Воронежская область",
        "Запорожская область",
        "Ивановская область",
        "Иркутская область",
        "Калининградская область",
        "Калужская область",
        "Кемеровская область",
        "Кировская область",
        "Костромская область",
        "Курганская область",
        "Курская область",
        "Ленинградская область",
        "Липецкая область",
        "Магаданская область",
        "Московская область",
        "Мурманская область",
        "Нижегородская область",
        "Новгородская область",
        "Новосибирская область",
        "Омская область",
        "Оренбургская область",
        "Орловская область",
        "Пензенская область",
        "Псковская область",
        "Ростовская область",
        "Рязанская область",
        "Самарская область",
        "Саратовская область",
        "Сахалинская область",
        "Свердловская область",
        "Смоленская область",
        "Тамбовская область",
        "Тверская область",
        "Томская область",
        "Тульская область",
        "Тюменская область",
        "Ульяновская область",
        "Херсонская область",
        "Челябинская область",
        "Ярославская область",
        "Москва",
        "Санкт-Петербург",
        "Еврейская автономная область",
        "Ненецкий автономный округ",
        "Ханты-Мансийский автономный округ - Югра",
        "Чукотский автономный округ",
        "Ямало-Ненецкий автономный округ",
        "Донецкая народная республика",
        "Луганская народная республика"

    ];

    function populateDropdown() {
        const filter = searchInput.value.toUpperCase();
        dropdownList.innerHTML = '';
        const sortedItems = regions
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
            selectedRegions.push(value); // Добавляем регион в массив выбранных
            const tag = document.createElement('div');
            tag.className = 'tag';
            tag.textContent = value;

            if (window.location.pathname === '/region-contacts') {
                tag.addEventListener('click', () => {
                    tag.remove();
                    selectedRegions = selectedRegions.filter(region => region !== value);
                    updateDisplayedContacts();
                });

                updateDisplayedContacts();
            }

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
        const icon = document.getElementById('dropdown-icon-3');
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
document.getElementById('clickPAKNAME').onclick = clickPAKNAME;


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

//Обработчик ПAK отрасль
document.getElementById('clickPAKOTRASL').onclick = clickPAKOTRASL;


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

//Функция для открытия/закрытия бургер-меню
function myFunctionForMyButtonMenu(event) {
    var myMenu = document.getElementById('burger-menu');

    // Переключаем состояние меню
    if (myMenu.style.display === 'none') {
        myMenu.style.display = 'flex';
    } else {
        myMenu.style.display = 'none';
    }
    
}


function submitApplication(type) {
    const showError = (elementId, message) => {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        } else {
            console.warn(`Элемент с id '${elementId}' не найден на странице`);
        }
    };

    const clearErrors = () => {
        document.querySelectorAll('.error-message').forEach(error => error.style.display = 'none');
    };

    const getInputValueById = (id) => {
        const inputElement = document.getElementById(id);
        if (inputElement) {
            return inputElement.value.trim(); // Возвращаем значение поля, если оно существует
        } else {
            console.warn(`Элемент с id "${id}" не найден.`);
            return ''; // Возвращаем пустую строку, если элемент не найден
        }
    };

    const collectCommonFormData = () => {
        return {
            companyName: getInputValueById("companyName"), // Название компании
            companyType: getInputValueById("companyType"), // Тип компании
            companyDescription: getInputValueById("companyDescription"), // Описание компании
            productNames: getInputValueById("productNames"), // Список продуктов
            serviceNames: getInputValueById("serviceNames"), // Список услуг
            logo: getInputValueById("logo"), // Ссылка на логотип
            video: getInputValueById("video"), // Ссылка на видео
            main_logo: getInputValueById("main_logo"), // Ссылка на основной логотип
            first_image: getInputValueById("first_image"), // Первая фотография
            second_image: getInputValueById("second_image"), // Вторая фотография
            third_image: getInputValueById("third_image"), // Третья фотография
            address: getInputValueById("address"), // Адрес
            phoneNumber: getInputValueById("phone"), // Телефонный номер
            telegram: getInputValueById("telegram"), // Ссылка на Telegram
            vk: getInputValueById("vk"), // Ссылка на ВКонтакте
            dzen: getInputValueById("dzen"), // Ссылка на Яндекс Дзен
            rutube: getInputValueById("rutube"), // Ссылка на RuTube
            website: getInputValueById("website"), // Ссылка на сайт
            inn: getInputValueById("inn"), // ИНН
            region: Array.from(document.querySelectorAll('#selected-tags .tag')).map(tag => tag.innerText.trim()), // Выбранные теги для региона
            isRegistered: document.getElementById('reg') ? document.getElementById('reg').checked : false, // Чекбокс регистрации
            agreePolicy: document.getElementById('agree').checked
        };
    };

    const collectAdditionalFormDataForSoftware = () => {
        return {
            type: 'ПО',
            isAI: document.getElementById('ai').checked,
            softwareclasses: Array.from(document.querySelectorAll('#selected-tags-1 .tag')).map(tag => tag.innerText.trim()),
            fields: Array.from(document.querySelectorAll('#selected-tags-2 .tag')).map(tag => tag.innerText.trim())
        };
    };

    const collectAdditionalFormDataForHardware = () => {
        return {
            type: 'ПАК',
            hardwareclasses: Array.from(document.querySelectorAll('#selected-tags-4 .tag')).map(tag => tag.innerText.trim()),
            fields: Array.from(document.querySelectorAll('#selected-tags-5 .tag')).map(tag => tag.innerText.trim())
        };
    };

    const validateRequiredFields = (formData) => {
        let isValid = true;
    
        const requiredFields = [
            { value: formData.companyName, id: 'companyNameError', message: "Это поле обязательное" },
            { value: formData.companyType, id: 'companyTypeError', message: "Это поле обязательное" },
            { value: formData.companyDescription, id: 'companyDescriptionError', message: "Это поле обязательное" },
            { value: formData.productNames, id: 'ProductError', message: "Это поле обязательное" },
            { value: formData.serviceNames, id: 'ServiceError', message: "Это поле обязательное" },
            { value: formData.logo, id: 'LogoError', message: "Это поле обязательное" },
            { value: formData.main_logo, id: 'MainLogoError', message: "Это поле обязательное" },
            { value: formData.region, id: 'RegionError', message: "Это поле обязательное" },
            { value: formData.address, id: 'AddressError', message: "Это поле обязательное" },
            { value: formData.agreePolicy, id: 'PolicyError', message: "Пожалуйста, подтвердите согласие" }
        ];
    
        requiredFields.forEach(field => {
            if (!field.value || (Array.isArray(field.value) && field.value.length === 0)) {
                showError(field.id, field.message);
                isValid = false;
            }
        });
    
        if (!formData.phoneNumber) {
            showError('PhoneError', "Это поле обязательное");
            isValid = false;
        } else if (formData.phoneNumber === '+7' || formData.phoneNumber.length !== 18) {
            showError('PhoneError', "Введите корректный номер телефона");
            isValid = false;
        }
    
        if (!formData.inn) {
            showError('INNError', "Это поле обязательное");
            isValid = false;
        } else if (formData.inn.length !== 10 && formData.inn.length !== 12) {
            showError('INNError', "Введите корректный ИНН");
            isValid = false;
        }

        if (formData.website && !formData.website.match(/^https?:\/\//)) {
            showError('WebsiteError', "Ссылка должна начинаться с http:// или https://");
            isValid = false;
        }

        if (type === 'ПО') {
            if (!formData.softwareclasses || formData.softwareclasses.length === 0) {
                showError('SoftClassError', "Выберите хотя бы один класс ПО");
                isValid = false;
            }
            if (!formData.fields || formData.fields.length === 0) {
                showError('FieldsError', "Укажите хотя бы одну область применения");
                isValid = false;
            }
        }
    
        if (type === 'ПАК') {
            if (!formData.hardwareclasses || formData.hardwareclasses.length === 0) {
                showError('HardClassError', "Выберите хотя бы один класс ПАК");
                isValid = false;
            }
            if (!formData.fields || formData.fields.length === 0) {
                showError('FieldsError', "Укажите хотя бы одну область применения");
                isValid = false;
            }
        }
    
        return isValid;
    };    

    clearErrors();
    const formData = collectCommonFormData();

    let additionalData = {};
    if (type === 'ПО') {
        additionalData = collectAdditionalFormDataForSoftware();
    } else {
        additionalData = collectAdditionalFormDataForHardware();
    }

    const finalFormData = { ...formData, ...additionalData };

    if (!validateRequiredFields(finalFormData)) {
        return;
    }

    fetch('/submit-application', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalFormData),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                openModal();
            } else {
                if (data.message.includes("Компания с таким ИНН")) {
                    showError('INNError', "Компания с таким ИНН уже существует");
                } else if (data.message.includes("Компания с таким именем")) {
                    showError('companyNameError', "Компания с таким именем уже существует");
                } else {
                    alert("Ошибка при отправке данных.");
                }
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert("Произошла ошибка при отправке.");
        });
}

// Открытие модального окна
function openModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Закрытие модального окна по клику на фон
function closeModal(event) {
    if (event.target === document.getElementById('modal')) {
        closeModalPopApp(); // Вызываем функцию для закрытия
    }
}

// Закрытие модального окна по клику на крестик
function closeModalPopApp() {
    document.getElementById('modal').style.display = 'none';
    document.body.style.overflowX = 'hidden';
    document.body.style.overflowY = 'auto';
}

function closeModalPopAppError() {
    document.getElementById('modal-error').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function submitApplicationChange() {
    const getInputValue = (placeholder) => {
        const inputElement = document.querySelector(`input[placeholder="${placeholder}"]`);
        if (inputElement) {
            return inputElement.value;
        } else {
            console.warn(`Элемент с плейсхолдером "${placeholder}" не найден.`);
            return ''; // Возвращаем пустую строку, если элемент не найден
        }
    };

    const showError = (elementId, message) => {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        } else {
            console.warn(`Элемент с id '${elementId}' не найден на странице`);
        }
    };

    const clearErrors = () => {
        document.querySelectorAll('.error-message').forEach(error => error.style.display = 'none');
    };

    const collectCommonFormData = () => {
        return {
            companyName: getInputValue("Наименование компании"),
            message: document.querySelector('textarea[placeholder="Опишите какую информацию хотите изменить"]').value,
            phoneNumber: getInputValue("Оставьте номер телефона для связи"),
            agreePolicy: document.getElementById('agree').checked
        };
    };

    // Валидация
    const validateRequiredFields = (formData) => {
        let isValid = true;
        const requiredFields = [
            { value: formData.companyName, id: 'CompanyNameError', message: "Это поле обязательное" },
            { value: formData.message, id: 'ProblemError', message: "Это поле обязательное" },
            { value: formData.agreePolicy, id: 'PolicyError', message: "Пожалуйста, подтвердите согласие" }
        ];

        requiredFields.forEach(field => {
            if (!field.value) {
                showError(field.id, field.message);
                isValid = false;
            }
        });

        if (!formData.phoneNumber) {
            showError('PhoneError', "Это поле обязательное");
            isValid = false;
        } else if (formData.phoneNumber === '+7' || formData.phoneNumber.length !== 18) {
            showError('PhoneError', "Введите корректный номер телефона");
            isValid = false;
        }

        return isValid;
    };

    clearErrors();
    const formData = collectCommonFormData();

    // Дополнительная обработка для ПО или оборудования (если нужно)
    let additionalData = {};
    // (если нужно, добавьте обработку данных для ПО или оборудования)

    const finalFormData = { ...formData, ...additionalData };

    if (!validateRequiredFields(formData)) {
        return;
    }

    fetch('/submit-application-update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalFormData),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                openModal(); // Если нужно, добавьте функцию для открытия модального окна
            } else {
                alert("Ошибка при отправке данных.");
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert("Произошла ошибка при отправке.");
        });
}

function submitApplicationDelete() {
    const getInputValue = (placeholder) => {
        const inputElement = document.querySelector(`input[placeholder="${placeholder}"]`);
        if (inputElement) {
            return inputElement.value;
        } else {
            console.warn(`Элемент с плейсхолдером "${placeholder}" не найден.`);
            return ''; // Возвращаем пустую строку, если элемент не найден
        }
    };

    const showError = (elementId, message) => {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        } else {
            console.warn(`Элемент с id '${elementId}' не найден на странице`);
        }
    };

    const clearErrors = () => {
        document.querySelectorAll('.error-message').forEach(error => error.style.display = 'none');
    };

    const collectCommonFormData = () => {
        return {
            companyName: getInputValue("Наименование компании"),
            message: document.querySelector('textarea[placeholder="Напишите почему хотите исключить компанию из реестра"]').value,
            phoneNumber: getInputValue("Оставьте номер телефона для связи"),
            agreePolicy: document.getElementById('agree').checked
        };
    };

    // Валидация
    const validateRequiredFields = (formData) => {
        let isValid = true;
        const requiredFields = [
            { value: formData.companyName, id: 'CompanyNameError', message: "Это поле обязательное" },
            { value: formData.message, id: 'ProblemError', message: "Это поле обязательное" },
            { value: formData.agreePolicy, id: 'PolicyError', message: "Пожалуйста, подтвердите согласие" }
        ];

        requiredFields.forEach(field => {
            if (!field.value) {
                showError(field.id, field.message);
                isValid = false;
            }
        });

        if (!formData.phoneNumber) {
            showError('PhoneError', "Это поле обязательное");
            isValid = false;
        } else if (formData.phoneNumber === '+7' || formData.phoneNumber.length !== 18) {
            showError('PhoneError', "Введите корректный номер телефона");
            isValid = false;
        }

        return isValid;
    };

    clearErrors();
    const formData = collectCommonFormData();

    let additionalData = {};
    const finalFormData = { ...formData, ...additionalData };

    if (!validateRequiredFields(formData)) {
        return;
    }

    fetch('/submit-application-delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalFormData),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                openModal(); // Если нужно, добавьте функцию для открытия модального окна
            } else {
                alert("Ошибка при отправке данных.");
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert("Произошла ошибка при отправке.");
        });
}

document.getElementById('clickPOR1').onclick = clickPOR1;

function clickPOR1() {
    const searchInput = document.getElementById('search-input');
    const dropdownList = document.getElementById('dropdown-list');
    const selectedTagsContainer = document.getElementById('selected-tags');
    const dropdown = document.getElementById('dropdown');
    const noResults = document.getElementById('no-results');

    const regions = [
        "Республика Адыгея",
        "Республика Алтай",
        "Республика Башкортостан",
        "Республика Бурятия",
        "Республика Дагестан",
        "Республика Ингушетия",
        "Кабардино-Балкарская Республика",
        "Республика Калмыкия",
        "Карачаево-Черкесская Республика",
        "Республика Карелия",
        "Республика Коми",
        "Республика Крым",
        "Республика Марий Эл",
        "Республика Мордовия",
        "Республика Саха (Якутия)",
        "Республика Северная Осетия - Алания",
        "Республика Татарстан",
        "Республика Тыва",
        "Удмуртская Республика",
        "Республика Хакасия",
        "Чеченская Республика",
        "Чувашская Республика",
        "Алтайский край",
        "Забайкальский край",
        "Камчатский край",
        "Краснодарский край",
        "Красноярский край",
        "Пермский край",
        "Приморский край",
        "Ставропольский край",
        "Хабаровский край",
        "Амурская область",
        "Архангельская область",
        "Астраханская область",
        "Белгородская область",
        "Брянская область",
        "Владимирская область",
        "Волгоградская область",
        "Вологодская область",
        "Воронежская область",
        "Запорожская область",
        "Ивановская область",
        "Иркутская область",
        "Калининградская область",
        "Калужская область",
        "Кемеровская область",
        "Кировская область",
        "Костромская область",
        "Курганская область",
        "Курская область",
        "Ленинградская область",
        "Липецкая область",
        "Магаданская область",
        "Московская область",
        "Мурманская область",
        "Нижегородская область",
        "Новгородская область",
        "Новосибирская область",
        "Омская область",
        "Оренбургская область",
        "Орловская область",
        "Пензенская область",
        "Псковская область",
        "Ростовская область",
        "Рязанская область",
        "Самарская область",
        "Саратовская область",
        "Сахалинская область",
        "Свердловская область",
        "Смоленская область",
        "Тамбовская область",
        "Тверская область",
        "Томская область",
        "Тульская область",
        "Тюменская область",
        "Ульяновская область",
        "Херсонская область",
        "Челябинская область",
        "Ярославская область",
        "Москва",
        "Санкт-Петербург",
        "Еврейская автономная область",
        "Ненецкий автономный округ",
        "Ханты-Мансийский автономный округ - Югра",
        "Чукотский автономный округ",
        "Ямало-Ненецкий автономный округ",
        "Донецкая народная республика",
        "Луганская народная республика"

    ];

    function populateDropdown() {
        const filter = searchInput.value.toUpperCase();
        dropdownList.innerHTML = '';
        const sortedItems = regions
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
        if (value) {
            selectedTagsContainer.innerHTML = '';
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

    function updateSearchInput() {
        const tags = Array.from(selectedTagsContainer.getElementsByClassName('tag'));
        searchInput.value = tags.map(tag => tag.textContent).join(' ');
    }

    function toggleDropdownVisibility(isVisible) {
        dropdown.style.display = isVisible ? 'block' : 'none';
        const icon = document.getElementById('dropdown-icon-6');
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


//Для админки

function showContent(contentId) {
    var contents = document.getElementsByClassName('content');
    for (var i = 0; i < contents.length; i++) {
        contents[i].style.display = 'none';
    }
    document.getElementById(contentId).style.display = 'block';
}

function toggleStateAdmin(event) {
    var toggleContainer = event.target.closest('.container-3');
    var poBlock = toggleContainer.nextElementSibling;
    var pakBlock = poBlock.nextElementSibling;

    var toggleButton = toggleContainer.querySelector('.toggle-button');
    var labelLeft = toggleContainer.querySelector('.label-left');
    var labelRight = toggleContainer.querySelector('.label-right');

    if (toggleButton.classList.contains('toggle-button-active')) {
        toggleButton.classList.remove('toggle-button-active');
        labelLeft.style.color = 'rgb(31, 43, 106, 0.5)';
        labelRight.style.color = 'rgb(31, 43, 106)';
        poBlock.style.display = 'none';
        pakBlock.style.display = 'block';
    } else {
        toggleButton.classList.add('toggle-button-active');
        labelLeft.style.color = 'rgb(31, 43, 106)';
        labelRight.style.color = 'rgb(31, 43, 106, 0.5)';
        poBlock.style.display = 'block';
        pakBlock.style.display = 'none';
    }
}

//Тумблер Российский /евразийский
function toggleState() {
    const toggleButton = document.querySelector('.toggle-button');
    toggleButton.classList.toggle('active');
    const labelLeft = document.querySelector('.label-left');
    const labelRight = document.querySelector('.label-right');
    if (toggleButton.classList.contains('active')) {
        labelLeft.style.color = 'rgba(31, 43, 106, 0.5)'; // Голубой цвет
        labelRight.style.color = 'rgba(31, 43, 106, 1)'; // Темносиний цвет
    } else {
        labelLeft.style.color = 'rgba(31, 43, 106, 1)'; // Темносиний цвет
        labelRight.style.color = 'rgba(31, 43, 106, 0.5)'; // Голубой цвет
    }
}