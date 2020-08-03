export function modifyRegionen(regionen, modifyArray) {

    let newRegionen = JSON.parse(JSON.stringify(regionen));

    for (var i = 0; i < modifyArray.length; i++) {
        for (var v = 0; v < modifyArray[i]['values'].length; v++) {
            newRegionen[modifyArray[i]['values'][v]]['color'] = modifyArray[i]['colors'];
        }
    }

    return newRegionen;
}

/* vim: set expandtab ts=4 sw=4 sts=4: */
