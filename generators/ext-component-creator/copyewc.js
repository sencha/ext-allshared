let run = require('./util').run

main()

async function main() {
    await run(`rm -rf ../../../ext-web-components/packages/ext-ewc/doc`)
    await run(`rm -rf ../../../ext-web-components/packages/ext-ewc/lib`)
    await run(`cp -R ./GeneratedFolders/ext-ewc/src/ ../../../ext-web-components/packages/ext-ewc/`)
}