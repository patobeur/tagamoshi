let _Front = {
    navigation: {
        brand: document.getElementById('brand'),
        menuItems: {
            'spacesheep': { url: '../sites/spacesheep.html', title: 'SpaceSheep', active: false },
            'index': { url: '../index.html', title: 'Tagamoshi', active: false },
            'notyet': { url: '#', title: 'notyet', active: false },
            'gotcha': { url: '../sites/gotcha.html', title: 'gotcha', active: false },
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
        }
    },
}
_Front.navigation.create(pagename)