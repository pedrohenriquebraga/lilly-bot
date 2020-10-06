const listCommand = document.querySelector('.commands')
const totalCommands = document.querySelector('.total_commands span')

axios.get('/api/commandList')
    .then(commands => {
        totalCommands.innerHTML = commands['data'].length
        for (command of commands['data']) {
            listCommand.innerHTML += `
            <div class="command_card">
                <h2 class="command_name">${command.name}</h2>
                <p class="command_desc">${command.description}</p>
                <span class="user_permissions"><strong>Permissões do Usuário: </strong><em>${command.userPermissions}</em></span>
                <span class="lilly_permissions"><strong>Permissões da Lilly: </strong><em>${command.lillyPermissions}</em></span>
                <span class="usage"><strong>Como usar: </strong><em>${command.usage}</em></span>
                <span class="aliases"><strong>Atalhos: </strong><em>${command.aliases.join(', ')}</em></span>
            </div>
            `
        }
    })
