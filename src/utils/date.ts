export const SECONDS_IN_A_DAY = 86400

export const getDiffInMinutes = (t1: number, t2: number) => {
    console.log(t1, t2)
    return (t1 - t2) / 60;
}

// export const getDiffInMillis = (d1: number, d2: number) => {
//     return (d1 - d2) / 60;
// }

export const getTomorrowString = () => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    return tomorrow.toDateString()
}