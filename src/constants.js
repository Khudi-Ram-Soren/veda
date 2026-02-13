export const userRoleEnum = {
  ADMIN: "ADMIN",
  INSTRUCTOR: "INSTRUCTOR",
  STUDENT: "STUDENT",
};

export const availableUserRoll = Object.values(userRoleEnum);

export const USER_TEMPRORARY_TOKEN = 20 * 60 * 1000;

export const courseLevelEnum = {
  BEGINEER: "BEGINNER",
  INTERMEDIATE: "INTERMEDIATE",
  ADVANCED: "ADVANCED",
};

export const availableCourseLevel = Object.values(levelEnum);

export const coursePurchaseStatusEnum = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILD: "FAILD",
  REFUNDED: "REFUNDED",
};

export const availableCoursePurchaseStatus = Object.values(
  coursePurchaseStatusEnum
);
