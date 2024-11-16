const fs = require("node:fs")
const path = require("node:path")
const joylashuv = path.resolve("databaseFolder", "data.json")

class Fruit {
    constructor(name, count, price) {
        this.name = name
        this.count = count
        this.price = price
    }
    info() {
        return { name: this.name, count: this.count, price: this.price }
    }
}


class DatabaseAction {
    constructor(lokation, Fruit, fs) {
        this.lokation = lokation
        this.Fruit = Fruit
        this.fs = fs
    }
//-----------------------------------------------------------------------------------------------------------------------------//
    async createFruits() {
        try {
            let data = [];
            try {
                const fileData = await fs.readFile(this.lokation, { encoding: "utf8" })
                data = JSON.parse(fileData);
            } catch (error) {
                console.log("file mavjud emas ekan yangi fayl yaratildi : ", error)
            }
            data.push(this.Fruit);
            
            await fs.writeFile(this.lokation, JSON.stringify(data, null, 2), { encoding: "utf8" })
            console.log("malumot bazaga qoshildi : ", this.Fruit)
        } catch (error) {
            console.log("tizimda xatolik : ", error)
        }
    }
    


    //---------------------------------------------------------------------------------------------------------------------------//
    async addFruit(name, newCount) {
        try {
            const fileData = await fs.readFile(this.lokation, { encoding: "utf8" })
            let data = JSON.parse(fileData);

            const fruit = data.find((item) => item.name === name);
            if (fruit) {
                fruit.count = newCount;
                console.log(`name : "${name}"  \ncount : ${newCount} ga yangilandi`)
            } else {
                console.log(`"${name}" bunday meva topilmadi`)
                return;
            }

            await fs.writeFile(this.lokation, JSON.stringify(data, null, 2), { encoding: "utf8" })
            console.log("databaza yangilandi")
        } catch (err) {
            console.error("error : ", err)
        }
    }
    



    //---------------------------------------------------------------------------------------------------------------------------//
    async soldFruit(soldName, soldCount) {
        try {
            const fileData = await fs.readFile(this.lokation, { encoding: "utf8" })
            let data = JSON.parse(fileData);
            
            const fruit = data.find((el) => el.name === soldName);
            if (fruit) {
                if (fruit.count >= soldCount) {
                    fruit.count -= soldCount;
                    console.log("haridingiz uchun raxmat")
                    await fs.writeFile(this.lokation, JSON.stringify(data, null, 2), { encoding: "utf8" })
                    console.log("databaza yangilandi");
                } else {
                    console.log("bizda buncha meva mavjud emas")
                }
            } else {
                console.log(`"${soldName}" bunday meva topilmadi`)
                return;
            }
        } catch (err) {
            console.error("error : ", err);
        }
    }
    




    //-------------------------------------------------------------------------------------------------------------------------------//
    getFruits() {
        const readStream = fs.createReadStream(this.lokation, { highWaterMark: 1024 });
        let i = 1;
        readStream.on("data", (chunk) => {
            console.log("-------------------------------- ", i, "kb", "  -------------------------------------");
            console.log(chunk.toString());
            i++;
        });
        readStream.on("end", () => {
            console.log("barcha malumotlar stream formatda")
        });
    }
    




    //----------------------------------------------------------------------------------------------------------------------------------//
    async deleteFruit(nameFruit) {
        try {
            const fileData = await fs.promises.readFile(this.lokation, { encoding: "utf8" });
            let data = JSON.parse(fileData);

            const initialLength = data.length;
            data = data.filter((fruit) => fruit.name !== nameFruit);

            if (data.length < initialLength) {
                await fs.promises.writeFile(this.lokation, JSON.stringify(data, null, 2), { encoding: "utf8" });
                console.log(`"${nameFruit}" nomli meva o'chirildi`);
            } else {
                console.log(`"${nameFruit}" nomli meva topilmadi`);
            }
        } catch (err) {
            console.error("Xatolik:", err);
        }
    }
}

const fruitData = new Fruit("olma", 12, 200)
const database = new DatabaseAction(joylashuv, fruitData, fs)

// database.createFruits()
// database.addFruit("olma", 10)
// database.soldFruit("banana", 1)
// database.getFruits()
// database.deleteFruit("banana")
