// Elementos DOM
const panel = document.getElementById('panel');
const cardView = document.getElementById('card-view');
const formContainer = document.getElementById('form-container');
const cardList = document.getElementById('card-list');
const addButton = document.getElementById('add-button');
const backButton = document.getElementById('back-button');
const cancelButton = document.getElementById('cancel-button');
const studentForm = document.getElementById('student-form');
const photoInput = document.getElementById('photo');
const photoPreview = document.getElementById('photo-preview');
const addToWalletButton = document.getElementById('add-to-wallet');

// Variáveis globais
let students = [];
let currentPhotoData = '';

// Variáveis para instalação do PWA
let deferredPrompt;
const installBanner = document.getElementById('install-banner');
const installButton = document.getElementById('install-button');
const closeBannerButton = document.getElementById('close-banner');

// Checar se o app já está instalado ou é executado como PWA
const isInStandaloneMode = () => (window.matchMedia('(display-mode: standalone)').matches) || (window.navigator.standalone) || document.referrer.includes('android-app://');

// Inicializar aplicativo
function initApp() {
    loadStudents();
    renderStudentCards();
    setupEventListeners();
    setupPWA();
}

// Versão do seed — incrementar invalida o cache do localStorage e recarrega o padrão
const SEED_VERSION = 4;

const DEFAULT_STUDENTS = [
    {
        id: 1,
        name: 'Igor Milhomem Borba',
        institution: 'Universidade Federal do Maranhão',
        course: 'Engenharia de Software',
        level: 'Graduação',
        cpf: '038.846.321-08',
        rg: '076419882022-5',
        birth: '2003-09-15',
        validity: '2027-03',
        photoData: 'igor.png',
        codeUse: 'IMB-2026A',
        registration: '2026001'
    },
    {
        id: 2,
        name: 'Juliana Felix Arnal Saez',
        institution: 'Universidade Federal de Curitiba',
        course: 'Administração',
        level: 'Graduação',
        cpf: '103.324.949-18',
        rg: '12.345.678-9',
        birth: '2002-04-22',
        validity: '2027-03',
        photoData: 'julia.png',
        codeUse: 'JFS-2026B',
        registration: '2026002'
    }
];

// Carregar estudantes do localStorage ou usar o seed padrão
function loadStudents() {
    const savedVersion = parseInt(localStorage.getItem('seedVersion'), 10);
    const savedStudents = localStorage.getItem('students');

    if (savedStudents && savedVersion === SEED_VERSION) {
        students = JSON.parse(savedStudents);
    } else {
        students = JSON.parse(JSON.stringify(DEFAULT_STUDENTS));
        localStorage.setItem('seedVersion', SEED_VERSION);
        saveStudents();
    }
}

// Salvar estudantes no localStorage
function saveStudents() {
    localStorage.setItem('students', JSON.stringify(students));
    // Também salvar em um formato similar ao db.json para referência
    const dbJson = JSON.stringify({ students: students }, null, 2);
    console.log('DB.json (simulado):', dbJson);
}

// Configurar event listeners
function setupEventListeners() {
    // Botão para adicionar nova carteirinha
    addButton.addEventListener('click', () => {
        showForm();
    });

    // Botão para voltar da visualização de carteirinha
    backButton.addEventListener('click', () => {
        hideCardView();
    });

    // Botão para cancelar formulário
    cancelButton.addEventListener('click', () => {
        hideForm();
    });

    // Botão para adicionar à carteira da Apple (simulado)
    addToWalletButton.addEventListener('click', () => {
        alert('Adicionando à Carteira (simulação)');
    });

    // Preview da foto selecionada
    photoInput.addEventListener('change', handlePhotoSelect);

    // Submissão do formulário
    studentForm.addEventListener('submit', handleFormSubmit);
}

// Renderizar cards de estudantes
function renderStudentCards() {
    cardList.innerHTML = '';
    
    if (students.length === 0) {
        cardList.innerHTML = '<p class="no-students">Nenhuma carteirinha cadastrada. Clique em "Adicionar Carteirinha" para começar.</p>';
        return;
    }
    
    students.forEach(student => {
        const card = document.createElement('div');
        card.className = 'student-card';
        card.dataset.id = student.id;
        
        card.innerHTML = `
            <div class="card-photo">
                <img src="${student.photoData}" alt="${student.name}">
            </div>
            <div class="card-info">
                <h3>${student.name}</h3>
                <p>${student.institution}</p>
                <p>${student.course}</p>
            </div>
        `;
        
        card.addEventListener('click', () => {
            showCardDetails(student.id);
        });
        
        cardList.appendChild(card);
    });
}

// Mostrar detalhes da carteirinha
function showCardDetails(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    
    // Preencher os dados da carteirinha
    document.getElementById('display-name').textContent = student.name.toUpperCase();
    document.getElementById('display-institution').textContent = `Inst. de Ensino: ${student.institution}`;
    document.getElementById('display-course').textContent = `Curso: ${student.course}`;
    document.getElementById('display-level').textContent = `Nível de Ensino: ${student.level}`;
    document.getElementById('display-cpf').textContent = `CPF: ${student.cpf}`;
    document.getElementById('display-rg').textContent = `RG: ${student.rg}`;
    
    // Adicionar número de matrícula (se disponível)
    const registration = student.registration || '1455447';
    document.getElementById('display-registration').textContent = `Matrícula: ${registration}`;
    
    // Formatar data de nascimento
    const birthDate = new Date(student.birth);
    const formattedBirth = birthDate.toLocaleDateString('pt-BR');
    document.getElementById('display-birth').textContent = `Data de Nasc.: ${formattedBirth}`;
    
    // Formatar validade
    const [year, month] = student.validity.split('-');
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const formattedValidity = `${monthNames[parseInt(month)-1]} de ${year}`;
    document.getElementById('display-validity').textContent = `Validade: ${formattedValidity}`;
    
    // Definir foto
    document.getElementById('display-photo').src = student.photoData;
    
    // Mostrar código de uso
    document.getElementById('display-code-use').textContent = `Cod. uso: ${student.codeUse}`;
    
    // Mostrar a visualização da carteirinha
    cardView.style.display = 'block';
}

// Esconder visualização da carteirinha
function hideCardView() {
    cardView.style.display = 'none';
}

// Mostrar formulário de cadastro
function showForm() {
    formContainer.style.display = 'block';
    studentForm.reset();
    photoPreview.innerHTML = '';
    currentPhotoData = '';
}

// Esconder formulário de cadastro
function hideForm() {
    formContainer.style.display = 'none';
}

// Manipular a seleção de foto
function handlePhotoSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        currentPhotoData = e.target.result;
        photoPreview.innerHTML = `<img src="${currentPhotoData}" alt="Preview">`;
    };
    reader.readAsDataURL(file);
}

// Manipular a submissão do formulário
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Validar formulário
    const name = document.getElementById('name').value;
    const institution = document.getElementById('institution').value;
    const course = document.getElementById('course').value;
    const level = document.getElementById('level').value;
    const cpf = document.getElementById('cpf').value;
    const rg = document.getElementById('rg').value;
    const registration = document.getElementById('registration').value || Math.floor(1000000 + Math.random() * 9000000).toString();
    const birth = document.getElementById('birth').value;
    const validity = document.getElementById('validity').value;
    
    if (!currentPhotoData) {
        alert('Por favor, selecione uma foto.');
        return;
    }
    
    // Criar novo estudante
    const newId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;
    
    // Gerar código de uso aleatório
    const codeUse = generateRandomCode();
    
    const newStudent = {
        id: newId,
        name,
        institution,
        course,
        level,
        cpf,
        rg,
        registration,
        birth,
        validity,
        photoData: currentPhotoData,
        codeUse
    };
    
    // Adicionar à lista e salvar
    students.push(newStudent);
    saveStudents();
    renderStudentCards();
    
    // Esconder formulário e mostrar detalhes da nova carteirinha
    hideForm();
    showCardDetails(newId);
}

// Gerar código aleatório para a carteirinha
function generateRandomCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    
    // Formato: XXX-XXXXX ou similar
    for (let i = 0; i < 3; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    code += '-';
    
    for (let i = 0; i < 4; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return code;
}

// Configurar funcionalidade de PWA
function setupPWA() {
    // Se o app já está instalado, não mostra o banner
    if (isInStandaloneMode()) {
        return;
    }
    
    // Capturar o evento beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevenir que o Chrome mostre o prompt automaticamente
        e.preventDefault();
        // Armazenar o evento para que possa ser acionado mais tarde
        deferredPrompt = e;
        // Mostrar o banner de instalação
        installBanner.classList.add('show');
    });
    
    // Adicionar evento de clique ao botão de instalação
    installButton.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        
        // Mostrar o prompt de instalação
        deferredPrompt.prompt();
        
        // Esperar pela escolha do usuário
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`Usuário ${outcome === 'accepted' ? 'aceitou' : 'recusou'} a instalação`);
        
        // Limpar a referência, pois o prompt só pode ser usado uma vez
        deferredPrompt = null;
        
        // Esconder o banner de instalação
        installBanner.classList.remove('show');
    });
    
    // Adicionar evento para fechar o banner
    closeBannerButton.addEventListener('click', () => {
        installBanner.classList.remove('show');
    });
    
    // Evento que ocorre após a instalação bem-sucedida
    window.addEventListener('appinstalled', (e) => {
        console.log('Aplicativo instalado com sucesso');
        // Esconder o banner de instalação
        installBanner.classList.remove('show');
        // Limpar a referência
        deferredPrompt = null;
    });
}

// Inicializar o aplicativo quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initApp); 