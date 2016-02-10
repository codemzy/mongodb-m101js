db.companies.aggregate([
    { $match: { funding_rounds: { $ne: [ ] } } },
    { $unwind: "$funding_rounds" },
    { $sort: { "funding_rounds.funded_year": 1,
               "funding_rounds.funded_month": 1,
               "funding_rounds.funded_day": 1 } },
    { $group: {
        _id: { company: "$name" },
        funding: {
            $push: {
                amount: "$funding_rounds.raised_amount",
                year: "$funding_rounds.funded_year" 
            } }
    } },
] ).pretty()



db.companies.aggregate([
    { $match: { funding_rounds: { $exists: true, $ne: [ ] } } },
    { $unwind: "$funding_rounds" },
    { $sort: { "funding_rounds.funded_year": 1,
               "funding_rounds.funded_month": 1,
               "funding_rounds.funded_day": 1 } },
    { $group: {
        _id: { company: "$name" },
        first_round: { $first: "$funding_rounds" }, 
        last_round: { $last: "$funding_rounds" },
        num_rounds: { $sum: 1 },
        total_raised: { $sum: "$funding_rounds.raised_amount" }
    } },
    { $project: {
        _id: 0,
        company: "$_id.company",
        first_round: {
            amount: "$first_round.raised_amount",
            article: "$first_round.source_url",
            year: "$first_round.funded_year"
        },
        last_round: {
            amount: "$last_round.raised_amount",
            article: "$last_round.source_url",
            year: "$last_round.funded_year"
        },
        num_rounds: 1,
        total_raised: 1,
    } },
    { $sort: { total_raised: -1 } }
] ).pretty()





db.companies.find({ name: "Fox Interactive Media" })

