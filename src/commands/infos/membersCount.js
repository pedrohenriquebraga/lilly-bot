module.exports = {
    name: 'memberscount',
    description: 'Mostra quantos membros tem no servidor',
    args: false,
    guildOnly: true,
    userPermissions: 'Nenhuma',
    lillyPermissions: 'Nenhuma',
    aliases: ['contemembros', 'contarmembros', 'quantidademembros'],
    usage: '$membersCount',
    execute(msg, args) {
        return msg.reply(`\n👥 | Total de membros: ${msg.guild.memberCount}`)
    }
}