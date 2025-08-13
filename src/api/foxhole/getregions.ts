import FoxholeApi from "../../data/foxhole/api"

/**
 * returns all the maps
 */
export default async () => {
    return await FoxholeApi.getMaps()
}