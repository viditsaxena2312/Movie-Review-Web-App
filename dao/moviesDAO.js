
let movies

export default class MoviesDAO{
    static async injectDB(conn){
        if(movies){
            return
        }
        try{
            movies = await conn.db(process.env.MOVIESREVIEWS_NV).collection('movies')
        }
        catch(err){
            console.error(`unable to connect in MoviesDAO: ${err}`)
        }
    }
    
    static async getMovies({
        filters = null,
        page = 0, 
        moviesPerPage = 20,} ={}){
            let query
            if(filters){
                if("title" in filters){
                    query = { $text: {$search: filters['title']}}
                }
                else if("rated" in filters){
                    query = { "rated": {$eq:filtes['rated']}}
                }
            }
            let cursor
            try{
                cursor = await movies
                .find(query)
                .limit(moviesPerPage)
                .skip(moviesPerPage*page)

                const moviesList = await cursor.toArray()
                const totalNumMovies = await movies.countDocuments(query)
                return{moviesList,totalNumMovies}
            }
            catch(err){
                console.error(`unable to issue find command, ${err}`)
                return {
                    moviesList: [],
                    totalNumMovies: 0
                }
            }
        }
}