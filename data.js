const fs = require("fs/promises")
const path = require("path")

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
    constructor(lokation, Fruit) {
        this.lokation = lokation
        this.Fruit = Fruit
    }

    async createFruits() {
        try {
            let data = []
            try {
                const fileData = await fs.readFile(this.lokation, "utf8")
                data = JSON.parse(fileData)
            } catch (error) {
                console.log("Fayl mavjud emas, yangi fayl yaratiladi.")
            }
            data.push(this.Fruit.info())
            await fs.writeFile(this.lokation, JSON.stringify(data, null, 2), "utf8")
            console.log("Malumot bazaga qo'shildi : ", this.Fruit.info())
        } catch (error) {
            console.error("Xato:", error)
        }
    }

    async addFruit(name, newCount) {
        try {
            const fileData = await fs.readFile(this.lokation, "utf8")
            let data = JSON.parse(fileData);

            const fruit = data.find((item) => item.name === name)
            if (fruit) {
                fruit.count = newCount;
                console.log(`"${name}" ning counti ${newCount} ga yangilandi`)
            } else {
                console.log(`"${name}" meva topilmadi`)
                return;
            }
            await fs.writeFile(this.lokation, JSON.stringify(data, null, 2), "utf8")
            console.log("Malumotlar bazasi yangilandi")
        } catch (err) {
            console.error("Xato:", err)
        }
    }

    async soldFruit(soldName, soldCount) {
        try {
            const fileData = await fs.readFile(this.lokation, "utf8")
            let data = JSON.parse(fileData)

            const fruit = data.find((el) => el.name === soldName)
            if (fruit) {
                if (fruit.count >= soldCount) {
                    fruit.count -= soldCount
                    console.log("Haridingiz uchun rahmat!")
                    await fs.writeFile(this.lokation, JSON.stringify(data, null, 2), "utf8")
                    console.log("Malumotlar bazasi yangilandi")
                } else {
                    console.log("Bizda buncha meva mavjud emas")
                }
            } else {
                console.log(`"${soldName}" bunday meva topilmadi`)
                return;
            }
        } catch (err) {
            console.error("Xato:", err)
        }
    }

    async getFruits() {
        try {
            const fileData = await fs.readFile(this.lokation, "utf8")
            console.log("Barcha malumotlar:\n", fileData)
        } catch (error) {
            console.error("Xato:", error)
        }
    }

    async deleteFruit(nameFruit) {
        try {
            const fileData = await fs.readFile(this.lokation, "utf8")
            let data = JSON.parse(fileData)

            const initialLength = data.length
            data = data.filter((fruit) => fruit.name !== nameFruit)

            if (data.length < initialLength) {
                await fs.writeFile(this.lokation, JSON.stringify(data, null, 2), "utf8")
                console.log(`"${nameFruit}" meva o'chirildi.`)
            } else {
                console.log(`"${nameFruit}" meva topilmadi.`)
            }
        } catch (err) {
            console.error("Xato:", err)
        }
    }
}

const fruitData = new Fruit("Olma", 12, 200)
const database = new DatabaseAction(joylashuv, fruitData)

// database.createFruits()
// database.addFruit("Olma", 20)
// database.soldFruit("Olma", 5)
// database.getFruits()
// database.deleteFruit("Olma")
