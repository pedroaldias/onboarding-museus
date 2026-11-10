class Work {
  const Work({
    required this.id,
    required this.attractionId,
    required this.title,
    required this.author,
    required this.description,
  });

  final int id;
  final int attractionId;
  final String title;
  final String author;
  final String description;

  factory Work.fromJson(Map<String, dynamic> json) {
    return Work(
      id: json['id'] as int,
      attractionId: json['attraction_id'] as int,
      title: json['title'] as String,
      author: json['author'] as String,
      description: json['description'] as String,
    );
  }
}
