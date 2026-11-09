const skills = document.querySelectorAll('.skill-box');
const descricao = document.querySelector('.texto-descricao');
const sobreSkill = [
                    '<p>Para sua casa</p> <br> <p>Clique e saiba mais...</p> <br>',
                    '<p>Para o seu condomínio</p> <br> <p>Clique e saiba mais...</p> <br>',
                    '<p>Para o seu négocio</p> <br> <p>Clique e saiba mais...</p> <br>',
                    '<p>Para sua indústria</p> <br> <p>Clique e saiba mais...</p> <br>',
                    '<p>Limpeza e higienização</p> <br> <p>Clique e saiba mais...</p> <br>',
                    '<p>Monitoramento e prevenção</p> <br> <p>Clique e saiba mais...</p> <br>',
                    '<p>A importância da desinsetização</p> <br> <p>Clique e saiba mais...</p> <br>',
                    '<p>Controle de pragas em ambiente específicos</p> <br> <p>Clique e saiba mais...</p> <br>'
]
const dataInicio = [
                    (new Date(2021, 10, 1)).getTime(), // 0
                    (new Date(2021, 10, 1)).getTime(), // 1
                    (new Date(2022, 0, 1)).getTime(), // 2
                    (new Date(2022, 3, 1)).getTime(), // 3
                    (new Date(2022, 3, 1)).getTime(), // 4
                    (new Date(2022, 1, 1)).getTime(), // 5
                    (new Date(2021, 11, 1)).getTime(), // 6
                    (new Date(2021, 11, 1)).getTime(), // 7
                    ]
const dataHoje = (new Date()).getTime();

skills.forEach(  (elemento, index) => {
    let index1 = index;
    let elemento1 = elemento;
    elemento.addEventListener('mouseover', (evento) => {
        let tempo = 'mês';
        let tempoDeExperiencia = Math.round((dataHoje-dataInicio[index1])/(1000*60*60*24*30));
        if (tempoDeExperiencia > 1) tempo = 'meses'
        descricao.innerHTML = `<p>${sobreSkill[index1]} </p>` ;
    } )
    elemento.addEventListener('mouseout', (evento, elemento,) => {
        descricao.innerHTML = '>>> Xeque-Mate <<<';
    } )
} );



