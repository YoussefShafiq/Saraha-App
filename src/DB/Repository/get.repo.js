export async function findOne(model, filter = {}, select = '') {
    return await model.findOne(filter).select(select)
}

export async function findById(model, id, select = '') {
    return await model.findById(id).select(select)
}

export async function find(model, filter = {}, select = '') {
    return await model.find(filter).select(select)
}