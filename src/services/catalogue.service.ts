// This file includes a function to the the catalogue
//TODO: Fix function

// Use this function to get the catalogue from this project
export function getStaticCatalogue(path: string){
 return  Promise.resolve( fetch(path)
    .then((response) => response.json())
    .then((data) => {
       data;
    })
)

}

export function getCatalogueFromServer() {
    //TODO: implement
}


export const catalogueText = {
    group: 'Group',
    collapseButtonTitle: 'Collapse Tree',
    expandButtonTitle: 'Expand Tree',
    numberInput: {
        labelFrom: 'von',
        labelTo: 'bis'
    }
};
