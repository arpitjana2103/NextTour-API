// req.query demo
// req.query = {
//   slug: 'the-sea-explorer',
//   duration: '5',
//   'duration[gt]': '5',
//   difficulty: 'easy',
//   sort: '-price,ratingsAverage',
//   'price[lt]': '1000',
//   limit: '3',
//   page: '2',
//   fields: 'name,duration,ratingsAverage,price'
// }

class QueryFeatures {
    constructor(mongooseQuery, reqQuery) {
        this.mongooseQuery = mongooseQuery;
        this.reqQuery = reqQuery;
    }

    filter() {
        const filterObj = QueryFeatures.processReqQuery(this.reqQuery);
        this.mongooseQuery = this.mongooseQuery.find(filterObj);
        return this;
    }

    sort() {
        const sortedBy = QueryFeatures.processSortedBy(this.reqQuery.sort);
        this.mongooseQuery = this.mongooseQuery.sort(sortedBy);
        return this;
    }

    limitFields() {
        const fields = QueryFeatures.processFields(this.reqQuery.fields);
        this.mongooseQuery = this.mongooseQuery.select(fields);
        return this;
    }

    paginate() {
        const page = Number(this.reqQuery.page) || 1;
        const limitVal = Number(this.reqQuery.limit) || 5;
        const skipVal = (page - 1) * limitVal;
        this.mongooseQuery = this.mongooseQuery.skip(skipVal).limit(limitVal);
        return this;
    }

    static processReqQuery({ ...reqQuery }) {
        // 1. Exclude prohibited fields
        const excludeFields = ["page", "limit", "sort", "fields"];
        excludeFields.forEach((field) => delete reqQuery[field]);

        // 2. Add "$" before comparison operators
        let queryStr = JSON.stringify(reqQuery);
        const operators = ["gt", "gte", "lt", "lte"];
        operators.forEach(function (operator) {
            const regex = new RegExp(`(${operator})\\b`, "g");
            queryStr = queryStr.replace(regex, `$${operator}`);
        });
        reqQuery = JSON.parse(queryStr);

        return reqQuery;
    }

    static processSortedBy(sortedByStr) {
        if (!sortedByStr) return "-createdAt";
        return sortedByStr.replace(/,/g, " ");
    }

    static processFields(fieldsStr) {
        if (!fieldsStr) return "";
        return fieldsStr.replace(/,/g, " ");
    }
}

module.exports = QueryFeatures;
