import * as schoolsApi from 'api/schools';

class SchoolCache {
  schoolCache = {};

  getSchoolNameFromId = async id => {
    if (this.schoolCache[id] == null) {
      const school = await schoolsApi.getSchool(id);
      this.schoolCache[id] = school;
    }

    return this.schoolCache[id].name;
  };

  setSchoolForId = (id, school) => {
    this.schoolCache[id] = school;
  };
}
export const schoolCache = new SchoolCache();

class CourseCache {
  courseCache = {};

  getCourseNameFromId = async (schoolId, courseId) => {
    if (this.courseCache[courseId] == null) {
      const course = await schoolsApi.getCourse(schoolId, courseId);
      this.courseCache[courseId] = course;
    }
    return `${this.courseCache[courseId].course_code} - ${this.courseCache[courseId].name}`;
  };

  setCourseForId = (id, course) => {
    this.courseCache[id] = course;
  };
}
export const courseCache = new CourseCache();