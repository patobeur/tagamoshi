let _front = {
    navigation: {
        brand: document.getElementById('brand'),
        menuItems: {
            'spacesheep': { url: '/tagamoshi/sites/spacesheep.html', title: 'SpaceSheep', active: false },
            'index': { url: '/tagamoshi/index.html', title: 'Tagamoshi', active: false },
            'newton': { url: '/tagamoshi/sites/newton.html', title: 'newton', active: false },
            'gotcha': { url: '/tagamoshi/sites/gotcha.html', title: 'gotcha', active: false }
        },
        create: function (activepagename=false) {
            let i = 1;
            for (const key in this.menuItems) {
                if (Object.hasOwnProperty.call(this.menuItems, key)) {
                    const element = this.menuItems[key];

                    let up = activepagename === key ? ' up' : ''

                    let div = _T.tools.createDiv({tag: 'div', attributes: { className: "projet projet" + i + up },style: {}})
                    let anime = _T.tools.createDiv({tag: 'div', attributes: { className: "anime", textContent: "🎲" }})
                    let link = _T.tools.createDiv({tag: 'div', attributes: { className: "link" }})
                    let a = _T.tools.createDiv({tag: 'a', attributes: { className: "alink", textContent: element.title, target: "_self", href: element.url }})
                    link.appendChild(a)
                    div.appendChild(link)
                    div.appendChild(anime)
                    this.brand.prepend(div)
                }
                i++;
            };
        },
        resociaux: function (activepagename=false) {
            let rs = _T.tools.createDiv({tag: 'div', attributes: { className: "resociaux unselectable" }})
            let codepen = _T.tools.createDiv({
                tag: 'a', 
                attributes: { 
                    className: "codepen", 
                    target: "_codepen", 
                    title: "Nouvelle page sur Codepen !", 
                    href: (typeof fuseecodepen != 'undefined' && fuseecodepen) ? fuseecodepen : 'https://codepen.io/Patobeur'
            }})
            let github = _T.tools.createDiv({
                tag: 'a', 
                attributes: { 
                    className: "github", 
                    target: "_github", 
                    title: "Nouvelle page sur Github !",
                    href: (typeof fuseegithub != 'undefined' && fuseegithub) ? fuseegithub : 'https://github.com/patobeur'
            }})
            rs.appendChild(codepen)
            rs.appendChild(github)
            document.body.appendChild(rs)
        }
    },
}
if(pagename!='index') {_front.navigation.menuItems.index.url='../index.html'}
_front.navigation.create(pagename)
_front.navigation.resociaux(pagename)