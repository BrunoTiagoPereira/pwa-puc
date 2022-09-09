onload = () => {

    // Chave do localstorage
    const STORAGE_KEY = 'plates-data';

    // Busca o elemento pelo Id
    byId = (id) => document.getElementById(id);
    // Elementos utilizados
    const backButton = byId('back-button');
    const floatingButton = byId('floating-button');
    const navHeader = byId('nav-header');
    const errorMessagesContainer = byId('error-message-container');
    const errorMessagesContentContainer = byId('error-message-content-container');

    const homePageContainer = byId('home-page')
    const searchInput = byId('search-input');
    const platesList = byId('plates-list');

    const addPageContainer = byId('add-page');
    const addPageNameInput = byId('add-input-name');
    const addPageDescriptionInput = byId('add-input-description');
    const addPageIsFavoriteInput = byId('add-input-is-favorite');
    const addPageCancelButton = byId('add-page-cancel-button');
    const addPageSaveButton = byId('add-page-save-button');


    // Eventos
    backButton.onclick = () => {
       loadHomeScreen();
    }
    floatingButton.onclick = () => {
        loadAddScreen();
    }

    addPageCancelButton.onclick = () => {
       
        loadHomeScreen();
        
    }

    addPageSaveButton.onclick = () => {
        // Valida o nome do prato e verifica se deve mostrar erros
        const {hasError, errorMessages} = validateAddInputs();

        if(hasError){
            showErrorMessages(errorMessages);
            return;
        }

        // Caso esteja tudo correto, cria o prato e atualiza a tela
        
        const plate = {
            id: getNextId(),
            name: addPageNameInput.value,
            description: addPageDescriptionInput.value,
            isFavorite: addPageIsFavoriteInput.checked,
        }
        
        const data = getOrCreateData();

        data.push(plate);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    
        clearErrorMessages();
         
        loadHomeScreen();
        
    }

    searchInput.oninput = (e) => {

        // Filtra os pratos com o nome especificado
        const value = e.target.value;
        if(value && value !== ''){
            platesList.innerHTML = "";
            const data = _.filter(getOrCreateData(), (p) => p.name.includes(value))
            renderList(data);
        }
        else if(value === ''){
            platesList.innerHTML = "";
            renderList();
        }
        
    }


    // Carrega a tela de adicionar em branco
    loadAddScreen = () => {
        backButton.classList.remove('hidden')
        floatingButton.classList.add('hidden');
        setHeader('Adicionar Prato')
        addPageContainer.classList.remove('hidden');
        homePageContainer.classList.add('hidden');
    }

    // Carrega a tela principal em branco com os dados do localstorage
    loadHomeScreen = () => {

        
       errorMessagesContainer.classList.add('hidden');
       backButton.classList.add('hidden')
       floatingButton.classList.remove('hidden');
       setHeader('Pratos')
       addPageContainer.classList.add('hidden');

       addPageNameInput.value = '';
       addPageDescriptionInput.value = '';
       addPageIsFavoriteInput.checked = 0;

       homePageContainer.classList.remove('hidden');

       platesList.innerHTML = "";

       renderList();
    }

    // Muda o nome na navbar
    setHeader = (header) => {
        navHeader.innerHTML = header;
    }

    // Verifica se o nome informado pelo usuário é válido
    validateAddInputs = () => {
        const name = addPageNameInput.value;

        const errorMessages = [];

        if(!name || name === ''){
            errorMessages.push('O nome não pode ser vazio');
        }

        return {hasError: errorMessages.length > 0, errorMessages}
        
    }

    // Verifica se a key existe no storage se não cria um array vazio
    getOrCreateData = () => {
        let data = localStorage.getItem('plates-data');

        if(data){
           data = JSON.parse(data);
        }
        return data ?? [];
    }

    // Limpa as mensagens de erro
    clearErrorMessages = () => {
        errorMessagesContentContainer.innerHTML = "";
    }

    // Renderiza as mensagens de erro
    renderErrorMessages = (errorMessages) => {
        errorMessages.forEach(err => {
            var error = document.createElement('span');
            error.innerHTML = err;

            errorMessagesContentContainer.appendChild(error);
            
        })
    }

    // Mostra as mensagens de erro
    showErrorMessages = (errorMessages) => {
        
        clearErrorMessages();
        renderErrorMessages(errorMessages);
        errorMessagesContainer.classList.remove('hidden');
    }

    // Verifica o último Id da lista e gera um novo
    getNextId = () => {
        const data = getOrCreateData();

        const lastId = _.maxBy(data, (p) => p.id);

        if(!lastId){
            return 1;
        }
        return lastId.id + 1;
    }

    // Renderiza a lista de itens
    renderList = (data) => {
        const elements = data ?? getOrCreateData();

        const rootEl = document.createElement('ul');
        rootEl.className = 'plates-list-container'

        elements.forEach((plate) => {
            const plateEl = document.createElement('li');
            plateEl.className = 'plate-list-item-container'
            
            const plateInfoContainer = document.createElement('div');
            plateInfoContainer.className = 'plate-info-container'

            const plateNameEl = document.createElement('span');
            plateNameEl.className = 'plate-list-item-name';
            plateNameEl.innerHTML = plate.name;

            const plateDescriptionEl = document.createElement('span');
            plateDescriptionEl.className = 'plate-list-item-description';
            plateDescriptionEl.innerHTML = plate.description;

            const iconsContainerEl = document.createElement('div');
            iconsContainerEl.className = 'icon-container';

            const favoriteIconEl = document.createElement('i');
            favoriteIconEl.className = 'fa-solid fa-heart icon';

            const removeIconContainer = document.createElement('div');
            removeIconContainer.className = 'remove-icon-container';
            removeIconContainer.onclick = () => removeItem(plate.id);

            const removeIconEl = document.createElement('i');
            removeIconEl.className = 'fa-solid fa-trash icon red';

            const hr = document.createElement('hr');

            plateInfoContainer.appendChild(plateNameEl);
            plateInfoContainer.appendChild(plateDescriptionEl);

            removeIconContainer.appendChild(removeIconEl);

            if(plate.isFavorite){
                iconsContainerEl.appendChild(favoriteIconEl)
            }
         
            iconsContainerEl.appendChild(removeIconContainer)

            plateEl.appendChild(plateInfoContainer);
            plateEl.appendChild(iconsContainerEl);
            
            rootEl.appendChild(plateEl);
            rootEl.appendChild(hr);
        })

        platesList.appendChild(rootEl);
    }

    // Remove o item do storage e atualiza a tela
    removeItem = (id) => {
        const data = getOrCreateData();

        const newData = _.filter(data, (p) => p.id != id); 

        if(newData.length === 0){
            localStorage.removeItem(STORAGE_KEY);
        }
        else{
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
        }
        
        loadHomeScreen();
    }

    loadHomeScreen();
}

navigator.serviceWorker.register('./plates-sw.js');