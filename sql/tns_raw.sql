
--Function for part 1
create function getPercent(a INT , b varchar (100)) 
returns DECIMAL(10,2)
DETERMINISTIC
BEGIN
DECLARE result DECIMAL(10,2);
  SET result = null;
  select percent into result from sub_discipline where discipline_id = a and name = b;
  RETURN result;
end;

-- For part 1
select 
a.name as ResponsdentId, 
trim(substring_index(substring_index(d.category_name, '(', 1), '(', -1)) as Industry,
max(if(d.name = 'Search', value, null)) as 'Search',

max(if(d.name = 'Display', value, null)) as 'Display',
max(if(d.name = 'Display', getPercent(d.id, 'Direct') * d.value, null)) as 'Display Direct',
max(if(d.name = 'Display', getPercent(d.id, 'Ad Network') * d.value, null)) as 'Display Ad Network',
max(if(d.name = 'Display', getPercent(d.id, 'Programmatic') * d.value, null)) as 'Display Programmatic',

max(if(d.name = 'Online Video', value, null)) as 'Online Video',
max(if(d.name = 'Online Video', getPercent(d.id, 'Direct') * d.value, null)) as 'Online Video Direct',
max(if(d.name = 'Online Video', getPercent(d.id, 'Ad Network') * d.value, null)) as 'Online Video Ad Network',
max(if(d.name = 'Online Video', getPercent(d.id, 'Programmatic') * d.value, null)) as 'Online Video Programmatic',

max(if(d.name = 'YouTube Ad', value, null)) as 'YouTube Ad',
max(if(d.name = 'YouTube Ad', getPercent(d.id, 'Display Desktop') * d.value, null)) as 'YouTube Ad Display Desktop',
max(if(d.name = 'YouTube Ad', getPercent(d.id, 'Display Mobile') * d.value, null)) as 'YouTube Ad Display Mobile',
max(if(d.name = 'YouTube Ad', getPercent(d.id, 'Video Desktop') * d.value, null)) as 'YouTube Ad Video Desktop',
max(if(d.name = 'YouTube Ad', getPercent(d.id, 'Video Mobile') * d.value, null)) as 'YouTube Ad Video Mobile',

max(if(d.name = 'Facebook Ad', value, null)) as 'Facebook Ad',
max(if(d.name = 'Facebook Ad', getPercent(d.id, 'Display Desktop') * d.value, null)) as 'Facebook Ad Display Desktop',
max(if(d.name = 'Facebook Ad', getPercent(d.id, 'Display Mobile') * d.value, null)) as 'Facebook Ad Display Mobile',
max(if(d.name = 'Facebook Ad', getPercent(d.id, 'Video Desktop') * d.value, null)) as 'Facebook Ad Video Desktop',
max(if(d.name = 'Facebook Ad', getPercent(d.id, 'Video Mobile') * d.value, null)) as 'Facebook Ad Video Mobile',

max(if(d.name = 'Instagram Ad', value, null)) as 'Instagram Ad',
max(if(d.name = 'Instagram Ad', getPercent(d.id, 'Display') * d.value, null)) as 'Instagram Ad Display',
max(if(d.name = 'Instagram Ad', getPercent(d.id, 'Video') * d.value, null)) as 'Instagram Ad Video',

max(if(d.name = 'Twitter Ad', value, null)) as 'Twitter Ad',
max(if(d.name = 'LINE', value, null)) as 'LINE',
max(if(d.name = 'Instant Messaging', value, null)) as 'Instant Messaging',
max(if(d.name = 'Social', value, null)) as 'Social',
max(if(d.name = 'Native Ads', value, null)) as 'Native Ads',

max(if(d.name = 'Creative', value, null)) as 'Creative',
max(if(d.name = 'Creative', getPercent(d.id, 'Online Video') * d.value, null)) as 'Creative Online Video',
max(if(d.name = 'Creative', getPercent(d.id, 'Web Banner') * d.value, null)) as 'Creative Web Banner',
max(if(d.name = 'Creative', getPercent(d.id, 'Social Media') * d.value, null)) as 'Creative Social Media',

max(if(d.name = 'Others/', value, null)) as 'Others/'
from discipline d left join agency a on d.agency_id = a.id
where d.sheet = 1 and d.agency_id in (select agency_id from log where status = 'finish' and agency_id != 'T052')
group by d.agency_id, d.category_name 
order by a.seq, d.category_name 

-- For part 2
select agency.name as ResponsdentId,
max(if(qno = '1', answer, null)) as 'Q1',
max(if(qno = '2', substring_index(substring_index(answer, '@', 1), '@', -1), null)) as 'Q2',
max(if(qno = '3', answer, null)) as 'Q3',
max(if(qno = '4.1', answer, null)) as 'Q4.1',
max(if(qno = '4.2', answer, null)) as 'Q4.2',
max(if(qno = '5', answer, null)) as 'Q5',
max(if(qno = '6', answer, null)) as 'Q6',
max(if(qno = '7', answer, null)) as 'Q7',
max(if(qno = '8', answer, null)) as 'Q8',
max(if(qno = '9', answer, null)) as 'Q9',
max(if(qno = '10.1', answer, null)) as 'Q10.1',
max(if(qno = '10.2', answer, null)) as 'Q10.2'
from answer left join agency on answer.agency_id = agency.id
where agency_id in (select agency_id from log where status = 'finish' and agency_id != 'T052')
group by agency_id
order by agency.seq

