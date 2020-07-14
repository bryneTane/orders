interface product {
    [id: string]: string;
}

export default function csvOrderToJSON(csv: string) {

    let lines : string[] = csv.split("\n");

    var products = [];
    var order = {
        id: NaN,
        vat: NaN,
        total: NaN,
        products: new Array(),
        inconsistent: false
    };

    var headers: string[] = [];
    var headline;
    
    lines.forEach((elt: string, index: number) => {
        if(elt.toLowerCase().startsWith('order')) order.id = parseInt(elt.split(': ')[1]);
        if(elt.toLowerCase().startsWith('vat')) order.vat = parseFloat(elt.split(': ')[1]);
        if(elt.toLowerCase().startsWith('total')) order.total = parseFloat(elt.split(': ')[1]);
        if(elt.toLowerCase().startsWith('product,product_id,price')){
            headers = elt.split(",").map((elt: string) => {
                if(elt.startsWith('product_id')) return 'id';
                if(elt.startsWith('product')) return 'name';
                if(elt.startsWith('price')) return 'price';
                else{
                    order.inconsistent = true;
                    return "";
                }
            });
            headline = index;
        } 
    });

    if(!(order.id && order.total && order.vat) || order.id === NaN || order.total === NaN || order.vat === NaN){
        order.inconsistent = true;
    }
    
    if(headline){
        for (var i = headline+1; i < lines.length; i++) {
    
            var obj: product = {};
            var currentline : string[] = lines[i].split(",");
    
            for (var j = 0; j < headers.length; j++) {
                obj[headers[j]] = currentline[j];
                if(!currentline[j]) order.inconsistent = true;
            }
    
            products.push(obj);
            order.products = products;
    
        }
    }

    //return result; //JavaScript object
    return order; //JSON
}